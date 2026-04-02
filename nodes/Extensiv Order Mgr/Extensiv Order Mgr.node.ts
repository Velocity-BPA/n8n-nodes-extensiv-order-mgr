/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-extensivordermgr/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ExtensivOrderMgr implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Extensiv Order Mgr',
    name: 'extensivordermgr',
    icon: 'file:extensivordermgr.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Extensiv Order Mgr API',
    defaults: {
      name: 'Extensiv Order Mgr',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'extensivordermgrApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Product',
            value: 'product',
          },
          {
            name: 'Inventory',
            value: 'inventory',
          },
          {
            name: 'Warehouse',
            value: 'warehouse',
          },
          {
            name: 'Shipment',
            value: 'shipment',
          },
          {
            name: 'Channel',
            value: 'channel',
          }
        ],
        default: 'order',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Get All Orders', value: 'getAllOrders', description: 'Retrieve all orders with filtering options', action: 'Get all orders' },
    { name: 'Get Order', value: 'getOrder', description: 'Retrieve a specific order by ID', action: 'Get order' },
    { name: 'Create Order', value: 'createOrder', description: 'Create a new order', action: 'Create order' },
    { name: 'Update Order', value: 'updateOrder', description: 'Update an existing order', action: 'Update order' },
    { name: 'Delete Order', value: 'deleteOrder', description: 'Delete an order', action: 'Delete order' },
    { name: 'Ship Order', value: 'shipOrder', description: 'Mark order as shipped', action: 'Ship order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel an order', action: 'Cancel order' },
  ],
  default: 'getAllOrders',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['product'] } },
  options: [
    { name: 'Get All Products', value: 'getAllProducts', description: 'Retrieve all products with filtering', action: 'Get all products' },
    { name: 'Get Product', value: 'getProduct', description: 'Retrieve a specific product by ID', action: 'Get a product' },
    { name: 'Create Product', value: 'createProduct', description: 'Create a new product', action: 'Create a product' },
    { name: 'Update Product', value: 'updateProduct', description: 'Update an existing product', action: 'Update a product' },
    { name: 'Delete Product', value: 'deleteProduct', description: 'Delete a product', action: 'Delete a product' },
    { name: 'Get Product Inventory', value: 'getProductInventory', description: 'Get inventory levels for a product', action: 'Get product inventory' }
  ],
  default: 'getAllProducts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['inventory'] } },
  options: [
    { name: 'Get All Inventory', value: 'getAllInventory', description: 'Retrieve inventory levels across all products', action: 'Get all inventory' },
    { name: 'Get Inventory', value: 'getInventory', description: 'Retrieve specific inventory record', action: 'Get inventory' },
    { name: 'Create Inventory Adjustment', value: 'createInventoryAdjustment', description: 'Create inventory adjustment', action: 'Create inventory adjustment' },
    { name: 'Update Inventory', value: 'updateInventory', description: 'Update inventory levels', action: 'Update inventory' },
    { name: 'Get Inventory Movements', value: 'getInventoryMovements', description: 'Retrieve inventory movement history', action: 'Get inventory movements' }
  ],
  default: 'getAllInventory',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['warehouse'],
		},
	},
	options: [
		{
			name: 'Get All Warehouses',
			value: 'getAllWarehouses',
			description: 'Retrieve all warehouses',
			action: 'Get all warehouses',
		},
		{
			name: 'Get Warehouse',
			value: 'getWarehouse',
			description: 'Retrieve a specific warehouse',
			action: 'Get a warehouse',
		},
		{
			name: 'Create Warehouse',
			value: 'createWarehouse',
			description: 'Create a new warehouse',
			action: 'Create a warehouse',
		},
		{
			name: 'Update Warehouse',
			value: 'updateWarehouse',
			description: 'Update warehouse information',
			action: 'Update a warehouse',
		},
		{
			name: 'Delete Warehouse',
			value: 'deleteWarehouse',
			description: 'Delete a warehouse',
			action: 'Delete a warehouse',
		},
	],
	default: 'getAllWarehouses',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['shipment'] } },
  options: [
    { name: 'Get All Shipments', value: 'getAllShipments', description: 'Retrieve all shipments', action: 'Get all shipments' },
    { name: 'Get Shipment', value: 'getShipment', description: 'Retrieve a specific shipment', action: 'Get a shipment' },
    { name: 'Create Shipment', value: 'createShipment', description: 'Create a new shipment', action: 'Create a shipment' },
    { name: 'Update Shipment', value: 'updateShipment', description: 'Update shipment information', action: 'Update a shipment' },
    { name: 'Track Shipment', value: 'trackShipment', description: 'Get tracking information', action: 'Track a shipment' },
    { name: 'Generate Shipping Label', value: 'generateShippingLabel', description: 'Generate shipping label', action: 'Generate shipping label' },
  ],
  default: 'getAllShipments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['channel'] } },
  options: [
    { name: 'Get All Channels', value: 'getAllChannels', description: 'Retrieve all connected sales channels', action: 'Get all channels' },
    { name: 'Get Channel', value: 'getChannel', description: 'Retrieve a specific channel', action: 'Get a channel' },
    { name: 'Create Channel', value: 'createChannel', description: 'Connect a new sales channel', action: 'Create a channel' },
    { name: 'Update Channel', value: 'updateChannel', description: 'Update channel configuration', action: 'Update a channel' },
    { name: 'Sync Channel', value: 'syncChannel', description: 'Trigger channel synchronization', action: 'Sync a channel' },
  ],
  default: 'getAllChannels',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['getOrder', 'updateOrder', 'deleteOrder', 'shipOrder', 'cancelOrder'] } },
  default: '',
  placeholder: 'Enter order ID',
  description: 'The ID of the order',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'pending' },
    { name: 'Processing', value: 'processing' },
    { name: 'Shipped', value: 'shipped' },
    { name: 'Delivered', value: 'delivered' },
    { name: 'Cancelled', value: 'cancelled' },
  ],
  default: '',
  description: 'Filter orders by status',
},
{
  displayName: 'Channel',
  name: 'channel',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: '',
  placeholder: 'Enter channel name',
  description: 'Filter orders by sales channel',
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: '',
  description: 'Filter orders from this date',
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: '',
  description: 'Filter orders until this date',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: 1,
  typeOptions: { minValue: 1 },
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['order'], operation: ['getAllOrders'] } },
  default: 50,
  typeOptions: { minValue: 1, maxValue: 1000 },
  description: 'Number of orders to return per page',
},
{
  displayName: 'Order Data',
  name: 'orderData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'updateOrder'] } },
  default: '{}',
  description: 'Order data as JSON object',
},
{
  displayName: 'Shipping Data',
  name: 'shippingData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['shipOrder'] } },
  default: '{}',
  description: 'Shipping information as JSON object',
},
{
  displayName: 'Cancellation Reason',
  name: 'reason',
  type: 'string',
  displayOptions: { show: { resource: ['order'], operation: ['cancelOrder'] } },
  default: '',
  placeholder: 'Enter cancellation reason',
  description: 'Reason for cancelling the order',
},
{
  displayName: 'SKU',
  name: 'sku',
  type: 'string',
  default: '',
  description: 'Filter products by SKU',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts']
    }
  }
},
{
  displayName: 'Channel',
  name: 'channel',
  type: 'string',
  default: '',
  description: 'Filter products by channel',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts']
    }
  }
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  default: '',
  description: 'Filter products by status',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts']
    }
  }
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  default: 1,
  description: 'Page number for pagination',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts']
    }
  }
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 100,
  description: 'Number of products per page',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts']
    }
  }
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the product',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getProduct', 'updateProduct', 'deleteProduct', 'getProductInventory']
    }
  }
},
{
  displayName: 'Product Data',
  name: 'productData',
  type: 'json',
  required: true,
  default: '{}',
  description: 'Product information as JSON',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['createProduct', 'updateProduct']
    }
  }
},
{
  displayName: 'Warehouse ID',
  name: 'warehouseId',
  type: 'string',
  default: '',
  description: 'Filter inventory by warehouse ID',
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getProductInventory']
    }
  }
},
{
  displayName: 'Warehouse ID',
  name: 'warehouseId',
  type: 'string',
  displayOptions: { show: { resource: ['inventory'], operation: ['getAllInventory'] } },
  default: '',
  description: 'Filter by warehouse ID',
},
{
  displayName: 'SKU',
  name: 'sku',
  type: 'string',
  displayOptions: { show: { resource: ['inventory'], operation: ['getAllInventory'] } },
  default: '',
  description: 'Filter by product SKU',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['inventory'], operation: ['getAllInventory'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['inventory'], operation: ['getAllInventory'] } },
  default: 50,
  description: 'Number of records per page',
},
{
  displayName: 'Inventory ID',
  name: 'inventoryId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['inventory'], operation: ['getInventory', 'updateInventory'] } },
  default: '',
  description: 'The ID of the inventory record',
},
{
  displayName: 'Adjustment Data',
  name: 'adjustmentData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['inventory'], operation: ['createInventoryAdjustment'] } },
  default: '{}',
  description: 'Inventory adjustment data',
},
{
  displayName: 'Quantity Data',
  name: 'quantityData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['inventory'], operation: ['updateInventory'] } },
  default: '{}',
  description: 'Quantity update data',
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  displayOptions: { show: { resource: ['inventory'], operation: ['getInventoryMovements'] } },
  default: '',
  description: 'Start date for movement history',
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  displayOptions: { show: { resource: ['inventory'], operation: ['getInventoryMovements'] } },
  default: '',
  description: 'End date for movement history',
},
{
  displayName: 'Warehouse ID',
  name: 'warehouseIdMovements',
  type: 'string',
  displayOptions: { show: { resource: ['inventory'], operation: ['getInventoryMovements'] } },
  default: '',
  description: 'Filter movements by warehouse ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['warehouse'],
			operation: ['getAllWarehouses'],
		},
	},
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
	],
	default: 'active',
	description: 'Filter warehouses by status',
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['warehouse'],
			operation: ['getAllWarehouses'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['warehouse'],
			operation: ['getAllWarehouses'],
		},
	},
	default: 100,
	description: 'Number of results to return per page',
},
{
	displayName: 'Warehouse ID',
	name: 'warehouseId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['warehouse'],
			operation: ['getWarehouse', 'updateWarehouse', 'deleteWarehouse'],
		},
	},
	default: '',
	description: 'The ID of the warehouse',
},
{
	displayName: 'Warehouse Data',
	name: 'warehouseData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['warehouse'],
			operation: ['createWarehouse', 'updateWarehouse'],
		},
	},
	default: '{}',
	description: 'The warehouse data as JSON object',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  default: '',
  description: 'Filter by shipment status',
  displayOptions: { show: { resource: ['shipment'], operation: ['getAllShipments'] } },
},
{
  displayName: 'Carrier',
  name: 'carrier',
  type: 'string',
  default: '',
  description: 'Filter by carrier',
  displayOptions: { show: { resource: ['shipment'], operation: ['getAllShipments'] } },
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  default: '',
  description: 'Filter shipments from this date',
  displayOptions: { show: { resource: ['shipment'], operation: ['getAllShipments'] } },
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  default: '',
  description: 'Filter shipments to this date',
  displayOptions: { show: { resource: ['shipment'], operation: ['getAllShipments'] } },
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  default: 1,
  description: 'Page number for pagination',
  displayOptions: { show: { resource: ['shipment'], operation: ['getAllShipments'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Number of results per page',
  displayOptions: { show: { resource: ['shipment'], operation: ['getAllShipments'] } },
},
{
  displayName: 'Shipment ID',
  name: 'shipmentId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the shipment',
  displayOptions: { show: { resource: ['shipment'], operation: ['getShipment', 'updateShipment', 'trackShipment', 'generateShippingLabel'] } },
},
{
  displayName: 'Shipment Data',
  name: 'shipmentData',
  type: 'json',
  required: true,
  default: '{}',
  description: 'The shipment data as JSON object',
  displayOptions: { show: { resource: ['shipment'], operation: ['createShipment', 'updateShipment'] } },
},
{
  displayName: 'Label Options',
  name: 'labelOptions',
  type: 'json',
  default: '{}',
  description: 'Label generation options as JSON object',
  displayOptions: { show: { resource: ['shipment'], operation: ['generateShippingLabel'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['channel'], operation: ['getAllChannels'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'All', value: 'all' },
  ],
  default: 'all',
  description: 'Filter channels by status',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: { show: { resource: ['channel'], operation: ['getAllChannels'] } },
  options: [
    { name: 'Amazon', value: 'amazon' },
    { name: 'eBay', value: 'ebay' },
    { name: 'Shopify', value: 'shopify' },
    { name: 'WooCommerce', value: 'woocommerce' },
    { name: 'All', value: 'all' },
  ],
  default: 'all',
  description: 'Filter channels by type',
  required: false,
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['channel'], operation: ['getAllChannels'] } },
  default: 1,
  description: 'Page number for pagination',
  required: false,
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['channel'], operation: ['getAllChannels'] } },
  default: 50,
  description: 'Number of channels to return per page',
  required: false,
},
{
  displayName: 'Channel ID',
  name: 'channelId',
  type: 'string',
  displayOptions: { show: { resource: ['channel'], operation: ['getChannel', 'updateChannel', 'syncChannel'] } },
  default: '',
  description: 'The unique identifier of the channel',
  required: true,
},
{
  displayName: 'Channel Data',
  name: 'channelData',
  type: 'json',
  displayOptions: { show: { resource: ['channel'], operation: ['createChannel'] } },
  default: '{}',
  description: 'Channel configuration data as JSON',
  required: true,
},
{
  displayName: 'Channel Data',
  name: 'channelData',
  type: 'json',
  displayOptions: { show: { resource: ['channel'], operation: ['updateChannel'] } },
  default: '{}',
  description: 'Updated channel configuration data as JSON',
  required: true,
},
{
  displayName: 'Sync Options',
  name: 'syncOptions',
  type: 'json',
  displayOptions: { show: { resource: ['channel'], operation: ['syncChannel'] } },
  default: '{}',
  description: 'Synchronization options as JSON',
  required: false,
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'product':
        return [await executeProductOperations.call(this, items)];
      case 'inventory':
        return [await executeInventoryOperations.call(this, items)];
      case 'warehouse':
        return [await executeWarehouseOperations.call(this, items)];
      case 'shipment':
        return [await executeShipmentOperations.call(this, items)];
      case 'channel':
        return [await executeChannelOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('extensivordermgrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllOrders': {
          const queryParams: any = {};
          
          const status = this.getNodeParameter('status', i, '') as string;
          if (status) queryParams.status = status;
          
          const channel = this.getNodeParameter('channel', i, '') as string;
          if (channel) queryParams.channel = channel;
          
          const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
          if (dateFrom) queryParams.date_from = dateFrom;
          
          const dateTo = this.getNodeParameter('dateTo', i, '') as string;
          if (dateTo) queryParams.date_to = dateTo;
          
          const page = this.getNodeParameter('page', i, 1) as number;
          queryParams.page = page;
          
          const limit = this.getNodeParameter('limit', i, 50) as number;
          queryParams.limit = limit;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/orders${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orders/${orderId}`,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrder': {
          const orderData = this.getNodeParameter('orderData', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/orders`,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: orderData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const orderData = this.getNodeParameter('orderData', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/orders/${orderId}`,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: orderData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/orders/${orderId}`,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'shipOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const shippingData = this.getNodeParameter('shippingData', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/orders/${orderId}/ship`,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: shippingData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const reason = this.getNodeParameter('reason', i, '') as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/orders/${orderId}/cancel`,
            headers: {
              'Authorization': 'Bearer ' + credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: { reason },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProductOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('extensivordermgrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllProducts': {
          const sku = this.getNodeParameter('sku', i) as string;
          const channel = this.getNodeParameter('channel', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams: string[] = [];
          if (sku) queryParams.push(`sku=${encodeURIComponent(sku)}`);
          if (channel) queryParams.push(`channel=${encodeURIComponent(channel)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (page) queryParams.push(`page=${page}`);
          if (limit) queryParams.push(`limit=${limit}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/products${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProduct': {
          const productId = this.getNodeParameter('productId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/products/${productId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createProduct': {
          const productData = this.getNodeParameter('productData', i) as object;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/products`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true,
            body: productData
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateProduct': {
          const productId = this.getNodeParameter('productId', i) as string;
          const productData = this.getNodeParameter('productData', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/products/${productId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true,
            body: productData
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteProduct': {
          const productId = this.getNodeParameter('productId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/products/${productId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProductInventory': {
          const productId = this.getNodeParameter('productId', i) as string;
          const warehouseId = this.getNodeParameter('warehouseId', i) as string;

          const queryString = warehouseId ? `?warehouseId=${encodeURIComponent(warehouseId)}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/products/${productId}/inventory${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeInventoryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('extensivordermgrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllInventory': {
          const warehouseId = this.getNodeParameter('warehouseId', i) as string;
          const sku = this.getNodeParameter('sku', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams = new URLSearchParams();
          if (warehouseId) queryParams.append('warehouseId', warehouseId);
          if (sku) queryParams.append('sku', sku);
          if (page) queryParams.append('page', page.toString());
          if (limit) queryParams.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/inventory${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInventory': {
          const inventoryId = this.getNodeParameter('inventoryId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/inventory/${inventoryId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createInventoryAdjustment': {
          const adjustmentData = this.getNodeParameter('adjustmentData', i) as object;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/inventory/adjustments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: adjustmentData,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateInventory': {
          const inventoryId = this.getNodeParameter('inventoryId', i) as string;
          const quantityData = this.getNodeParameter('quantityData', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/inventory/${inventoryId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: quantityData,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInventoryMovements': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const warehouseIdMovements = this.getNodeParameter('warehouseIdMovements', i) as string;

          const queryParams = new URLSearchParams();
          if (dateFrom) queryParams.append('date_from', dateFrom);
          if (dateTo) queryParams.append('date_to', dateTo);
          if (warehouseIdMovements) queryParams.append('warehouseId', warehouseIdMovements);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/inventory/movements${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeWarehouseOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('extensivordermgrApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllWarehouses': {
					const status = this.getNodeParameter('status', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const qs: any = {};
					if (status) qs.status = status;
					if (page) qs.page = page;
					if (limit) qs.limit = limit;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/warehouses`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWarehouse': {
					const warehouseId = this.getNodeParameter('warehouseId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/warehouses/${warehouseId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createWarehouse': {
					const warehouseData = this.getNodeParameter('warehouseData', i) as object;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/warehouses`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: warehouseData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWarehouse': {
					const warehouseId = this.getNodeParameter('warehouseId', i) as string;
					const warehouseData = this.getNodeParameter('warehouseData', i) as object;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/warehouses/${warehouseId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: warehouseData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWarehouse': {
					const warehouseId = this.getNodeParameter('warehouseId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/warehouses/${warehouseId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeShipmentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('extensivordermgrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllShipments': {
          const status = this.getNodeParameter('status', i, '') as string;
          const carrier = this.getNodeParameter('carrier', i, '') as string;
          const dateFrom = this.getNodeParameter('dateFrom', i, '') as string;
          const dateTo = this.getNodeParameter('dateTo', i, '') as string;
          const page = this.getNodeParameter('page', i, 1) as number;
          const limit = this.getNodeParameter('limit', i, 50) as number;

          const queryParams = new URLSearchParams();
          if (status) queryParams.append('status', status);
          if (carrier) queryParams.append('carrier', carrier);
          if (dateFrom) queryParams.append('date_from', dateFrom);
          if (dateTo) queryParams.append('date_to', dateTo);
          if (page) queryParams.append('page', page.toString());
          if (limit) queryParams.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/shipments?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getShipment': {
          const shipmentId = this.getNodeParameter('shipmentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/shipments/${shipmentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createShipment': {
          const shipmentData = this.getNodeParameter('shipmentData', i, {}) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/shipments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: shipmentData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateShipment': {
          const shipmentId = this.getNodeParameter('shipmentId', i) as string;
          const shipmentData = this.getNodeParameter('shipmentData', i, {}) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/shipments/${shipmentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: shipmentData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'trackShipment': {
          const shipmentId = this.getNodeParameter('shipmentId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/shipments/${shipmentId}/track`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'generateShippingLabel': {
          const shipmentId = this.getNodeParameter('shipmentId', i) as string;
          const labelOptions = this.getNodeParameter('labelOptions', i, {}) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/shipments/${shipmentId}/labels`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: labelOptions,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeChannelOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('extensivordermgrApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllChannels': {
          const status = this.getNodeParameter('status', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams = new URLSearchParams();
          if (status && status !== 'all') queryParams.append('status', status);
          if (type && type !== 'all') queryParams.append('type', type);
          if (page) queryParams.append('page', page.toString());
          if (limit) queryParams.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/channels?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChannel': {
          const channelId = this.getNodeParameter('channelId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/channels/${channelId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createChannel': {
          const channelData = this.getNodeParameter('channelData', i) as string;
          let parsedChannelData: any;

          try {
            parsedChannelData = typeof channelData === 'string' ? JSON.parse(channelData) : channelData;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in channel data: ${error.message}`);
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/channels`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: parsedChannelData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateChannel': {
          const channelId = this.getNodeParameter('channelId', i) as string;
          const channelData = this.getNodeParameter('channelData', i) as string;
          let parsedChannelData: any;

          try {
            parsedChannelData = typeof channelData === 'string' ? JSON.parse(channelData) : channelData;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in channel data: ${error.message}`);
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/channels/${channelId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: parsedChannelData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'syncChannel': {
          const channelId = this.getNodeParameter('channelId', i) as string;
          const syncOptions = this.getNodeParameter('syncOptions', i) as string;
          let parsedSyncOptions: any = {};

          if (syncOptions) {
            try {
              parsedSyncOptions = typeof syncOptions === 'string' ? JSON.parse(syncOptions) : syncOptions;
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in sync options: ${error.message}`);
            }
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/channels/${channelId}/sync`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: parsedSyncOptions,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
