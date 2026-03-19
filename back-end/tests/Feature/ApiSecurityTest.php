<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_an_admin_account(): void
    {
        $this->postJson('/api/admin/register', [
            'name' => 'Unauthorized Admin',
            'email' => 'unauthorized-admin@example.com',
            'password' => 'Secret123!',
        ])->assertUnauthorized();
    }

    public function test_non_admin_user_cannot_create_an_admin_account(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/admin/register', [
            'name' => 'Unauthorized Admin',
            'email' => 'blocked-admin@example.com',
            'password' => 'Secret123!',
        ])->assertForbidden();
    }

    public function test_user_can_only_view_their_own_orders_and_tracking(): void
    {
        $product = $this->createProduct();
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();

        $ownersOrder = $this->createOrder($owner, $product);
        $otherUsersOrder = $this->createOrder($otherUser, $product, [
            'status' => 'processing',
        ]);

        Sanctum::actingAs($owner);

        $this->getJson("/api/users/{$owner->id}/orders")
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $ownersOrder->id);

        $this->getJson("/api/users/{$otherUser->id}/orders")
            ->assertForbidden();

        $this->getJson("/api/orders/{$ownersOrder->id}/tracking")
            ->assertOk()
            ->assertJsonPath('order_id', $ownersOrder->id);

        $this->getJson("/api/orders/{$otherUsersOrder->id}/tracking")
            ->assertForbidden();
    }

    public function test_non_admin_user_cannot_update_order_tracking(): void
    {
        $product = $this->createProduct();
        $user = User::factory()->create();
        $order = $this->createOrder($user, $product);

        Sanctum::actingAs($user);

        $this->postJson("/api/orders/{$order->id}/tracking", [
            'status' => 'processing',
            'description' => 'Trying to escalate access',
        ])->assertForbidden();
    }

    public function test_admin_can_view_user_orders_and_update_tracking(): void
    {
        $product = $this->createProduct();
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create();
        $order = $this->createOrder($customer, $product);

        Sanctum::actingAs($admin);

        $this->getJson("/api/users/{$customer->id}/orders")
            ->assertOk()
            ->assertJsonPath('0.id', $order->id);

        $this->postJson("/api/orders/{$order->id}/tracking", [
            'status' => 'processing',
            'description' => 'Order is being packed',
        ])->assertOk()
            ->assertJsonPath('order.status', 'processing');

        $this->assertDatabaseHas('order_tracking', [
            'order_id' => $order->id,
            'status' => 'processing',
            'description' => 'Order is being packed',
        ]);
    }

    public function test_order_creation_uses_authenticated_user_even_if_payload_contains_another_user_id(): void
    {
        $product = $this->createProduct(['price' => 15.50, 'stock' => 5]);
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/orders', [
            'user_id' => $otherUser->id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
        ])->assertCreated()
            ->assertJsonPath('user_id', $user->id)
            ->assertJsonPath('status', 'pending');

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $this->assertDatabaseMissing('orders', [
            'user_id' => $otherUser->id,
            'total_price' => 31.00,
        ]);

        $this->assertSame(3, $product->fresh()->stock);
    }

    public function test_registration_response_does_not_expose_sensitive_user_fields(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Safe User',
            'email' => 'safe-user@example.com',
            'password' => 'Secret123!',
            'remember' => true,
        ])->assertCreated();

        $userPayload = $response->json('user');

        $this->assertIsArray($userPayload);
        $this->assertArrayNotHasKey('password', $userPayload);
        $this->assertArrayNotHasKey('remember_token', $userPayload);
        $this->assertArrayNotHasKey('token', $response->json());
        $this->assertAuthenticatedAs(User::where('email', 'safe-user@example.com')->first());
    }

    public function test_login_uses_session_auth_without_returning_api_token(): void
    {
        $password = 'Secret123!';
        $user = User::factory()->create([
            'email' => 'session-user@example.com',
            'password' => bcrypt($password),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
            'remember' => true,
        ])->assertOk();

        $this->assertArrayNotHasKey('token', $response->json());
        $this->assertAuthenticatedAs($user);
    }

    private function createProduct(array $attributes = []): Product
    {
        return Product::create(array_merge([
            'name' => 'Test Product',
            'description' => 'A product used in feature tests.',
            'price' => 10.00,
            'stock' => 10,
        ], $attributes));
    }

    private function createOrder(User $user, Product $product, array $attributes = []): Order
    {
        $order = Order::create(array_merge([
            'user_id' => $user->id,
            'total_price' => 10.00,
            'status' => 'pending',
        ], $attributes));

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 10.00,
        ]);

        OrderTracking::create([
            'order_id' => $order->id,
            'status' => $order->status,
            'description' => 'Order placed',
        ]);

        return $order;
    }
}
