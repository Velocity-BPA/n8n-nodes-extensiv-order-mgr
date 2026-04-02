# n8n-nodes-extensiv-order-mgr

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for Extensiv Order Manager integration, providing access to 6 core resources for comprehensive order and inventory management. This node enables seamless automation of order processing, inventory tracking, warehouse operations, product management, shipment handling, and multi-channel commerce workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Order Management](https://img.shields.io/badge/Order-Management-orange)
![Inventory Control](https://img.shields.io/badge/Inventory-Control-green)
![Multi-Channel](https://img.shields.io/badge/Multi--Channel-Commerce-purple)

## Features

- **Complete Order Management** - Create, update, track, and fulfill orders with full lifecycle support
- **Real-time Inventory Control** - Monitor stock levels, adjust quantities, and sync inventory across channels
- **Product Catalog Management** - Manage product information, variants, pricing, and specifications
- **Warehouse Operations** - Handle multiple warehouses, locations, and distribution centers
- **Shipment Tracking** - Create shipments, generate labels, and track delivery status
- **Multi-Channel Integration** - Sync orders and inventory across multiple sales channels
- **Automated Workflows** - Trigger actions based on order status, inventory levels, and shipment events
- **Comprehensive Error Handling** - Built-in retry logic and detailed error reporting

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-extensiv-order-mgr`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-extensiv-order-mgr
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-extensiv-order-mgr.git
cd n8n-nodes-extensiv-order-mgr
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-extensiv-order-mgr
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Extensiv Order Manager API key | Yes |
| Environment | Production or Sandbox environment | Yes |
| Base URL | Custom API base URL (if applicable) | No |

## Resources & Operations

### 1. Order

| Operation | Description |
|-----------|-------------|
| Create | Create a new order with customer and line item details |
| Get | Retrieve order information by order ID |
| Get All | List orders with filtering and pagination options |
| Update | Update existing order details and status |
| Cancel | Cancel an order and update inventory |
| Get Status | Retrieve current order status and fulfillment progress |

### 2. Product

| Operation | Description |
|-----------|-------------|
| Create | Add new products to the catalog |
| Get | Retrieve product details by product ID or SKU |
| Get All | List products with search and filtering capabilities |
| Update | Update product information, pricing, and specifications |
| Delete | Remove products from the catalog |
| Get Variants | Retrieve product variants and options |

### 3. Inventory

| Operation | Description |
|-----------|-------------|
| Get | Get current inventory levels for specific items |
| Get All | List inventory across all products and locations |
| Update | Adjust inventory quantities and locations |
| Reserve | Reserve inventory for pending orders |
| Release | Release reserved inventory back to available stock |
| Transfer | Transfer inventory between warehouse locations |

### 4. Warehouse

| Operation | Description |
|-----------|-------------|
| Create | Add new warehouse locations |
| Get | Retrieve warehouse details and configuration |
| Get All | List all configured warehouses |
| Update | Update warehouse settings and information |
| Delete | Remove warehouse from system |
| Get Locations | Retrieve specific storage locations within warehouse |

### 5. Shipment

| Operation | Description |
|-----------|-------------|
| Create | Create shipments and generate shipping labels |
| Get | Retrieve shipment details and tracking information |
| Get All | List shipments with status filtering |
| Update | Update shipment details and carrier information |
| Track | Get real-time tracking updates |
| Cancel | Cancel shipments and update order status |

### 6. Channel

| Operation | Description |
|-----------|-------------|
| Create | Add new sales channels |
| Get | Retrieve channel configuration and settings |
| Get All | List all configured sales channels |
| Update | Update channel settings and mappings |
| Delete | Remove sales channel integration |
| Sync | Trigger manual sync of orders and inventory |

## Usage Examples

```javascript
// Create a new order
{
  "customer": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "555-0123"
  },
  "shipping_address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "line_items": [
    {
      "sku": "PROD-001",
      "quantity": 2,
      "unit_price": 29.99
    }
  ]
}
```

```javascript
// Update inventory levels
{
  "sku": "PROD-001",
  "warehouse_id": "WH-001",
  "quantity": 100,
  "adjustment_type": "set",
  "reason": "Stock replenishment"
}
```

```javascript
// Create shipment with tracking
{
  "order_id": "ORD-12345",
  "carrier": "UPS",
  "service": "Ground",
  "tracking_number": "1Z999AA1234567890",
  "items": [
    {
      "sku": "PROD-001",
      "quantity": 2
    }
  ]
}
```

```javascript
// Get orders with filtering
{
  "status": "pending",
  "date_from": "2024-01-01",
  "date_to": "2024-01-31",
  "channel": "shopify",
  "limit": 50,
  "offset": 0
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials |
| 404 Not Found | Resource ID does not exist | Check resource ID and ensure it exists |
| 400 Bad Request | Invalid request parameters or format | Review request payload and required fields |
| 429 Rate Limited | Too many requests in time period | Implement delay between requests |
| 500 Server Error | Extensiv Order Manager service issue | Retry request or check service status |
| Network Timeout | Request timed out | Increase timeout or retry request |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-extensiv-order-mgr/issues)
- **Extensiv Documentation**: [Extensiv Order Manager API Docs](https://docs.extensiv.com/)
- **Community**: [n8n Community Forum](https://community.n8n.io/)