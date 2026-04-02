/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ExtensivOrderMgr } from '../nodes/Extensiv Order Mgr/Extensiv Order Mgr.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ExtensivOrderMgr Node', () => {
  let node: ExtensivOrderMgr;

  beforeAll(() => {
    node = new ExtensivOrderMgr();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Extensiv Order Mgr');
      expect(node.description.name).toBe('extensivordermgr');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key',
        baseUrl: 'https://api.skubana.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() },
    };
  });

  test('should get all orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllOrders')
      .mockReturnValueOnce('pending')
      .mockReturnValueOnce('shopify')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-12-31')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50);

    const mockResponse = { orders: [{ id: 1, status: 'pending' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.skubana.com/v1/orders?status=pending&channel=shopify&date_from=2023-01-01&date_to=2023-12-31&page=1&limit=50',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should get a specific order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrder')
      .mockReturnValueOnce('12345');

    const mockResponse = { id: 12345, status: 'shipped' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.skubana.com/v1/orders/12345',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should create an order successfully', async () => {
    const orderData = { customer: 'John Doe', items: [{ sku: 'ABC123', qty: 1 }] };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createOrder')
      .mockReturnValueOnce(orderData);

    const mockResponse = { id: 67890, status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.skubana.com/v1/orders',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: orderData,
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getOrder').mockReturnValueOnce('12345');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getOrder').mockReturnValueOnce('12345');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Product Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.skubana.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  test('getAllProducts operation should make correct API call', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllProducts')
      .mockReturnValueOnce('test-sku')
      .mockReturnValueOnce('test-channel')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ products: [] });

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.skubana.com/v1/products?sku=test-sku&channel=test-channel&status=active&page=1&limit=50',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      json: true
    });

    expect(result).toHaveLength(1);
  });

  test('getProduct operation should make correct API call', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProduct')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: '123' });

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.skubana.com/v1/products/123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      json: true
    });

    expect(result).toHaveLength(1);
  });

  test('createProduct operation should make correct API call', async () => {
    const productData = { name: 'Test Product', sku: 'TEST-001' };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createProduct')
      .mockReturnValueOnce(productData);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: '456' });

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.skubana.com/v1/products',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      json: true,
      body: productData
    });

    expect(result).toHaveLength(1);
  });

  test('should handle API errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProduct')
      .mockReturnValueOnce('invalid-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Product not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json.error).toBe('Product not found');
  });
});

describe('Inventory Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.skubana.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all inventory successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllInventory')
      .mockReturnValueOnce('warehouse1')
      .mockReturnValueOnce('SKU123')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      items: [{ id: '1', sku: 'SKU123', quantity: 100 }]
    });

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.items).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/inventory'),
      })
    );
  });

  it('should get specific inventory successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getInventory')
      .mockReturnValueOnce('inv123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'inv123', sku: 'SKU123', quantity: 100
    });

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('inv123');
  });

  it('should create inventory adjustment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createInventoryAdjustment')
      .mockReturnValueOnce({ sku: 'SKU123', adjustment: 10, reason: 'recount' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'adj123', status: 'created'
    });

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('adj123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/inventory/adjustments'),
      })
    );
  });

  it('should update inventory successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateInventory')
      .mockReturnValueOnce('inv123')
      .mockReturnValueOnce({ quantity: 150 });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'inv123', quantity: 150
    });

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.quantity).toBe(150);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: expect.stringContaining('/inventory/inv123'),
      })
    );
  });

  it('should get inventory movements successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getInventoryMovements')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-01-31')
      .mockReturnValueOnce('warehouse1');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      movements: [{ id: '1', type: 'adjustment', quantity: 10 }]
    });

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.movements).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/inventory/movements'),
      })
    );
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllInventory');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllInventory');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Warehouse Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.skubana.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllWarehouses', () => {
		it('should retrieve all warehouses successfully', async () => {
			const mockResponse = { warehouses: [{ id: 1, name: 'Warehouse 1' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllWarehouses')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(100);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWarehouseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle errors when retrieving all warehouses', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllWarehouses');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWarehouseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getWarehouse', () => {
		it('should retrieve a specific warehouse successfully', async () => {
			const mockResponse = { id: 1, name: 'Warehouse 1' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWarehouse')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWarehouseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('createWarehouse', () => {
		it('should create a warehouse successfully', async () => {
			const warehouseData = { name: 'New Warehouse', location: 'New York' };
			const mockResponse = { id: 123, ...warehouseData };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWarehouse')
				.mockReturnValueOnce(warehouseData);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWarehouseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('updateWarehouse', () => {
		it('should update a warehouse successfully', async () => {
			const warehouseData = { name: 'Updated Warehouse' };
			const mockResponse = { id: 123, ...warehouseData };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWarehouse')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce(warehouseData);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWarehouseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('deleteWarehouse', () => {
		it('should delete a warehouse successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWarehouse')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWarehouseOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('Shipment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.skubana.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get all shipments successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllShipments')
      .mockReturnValueOnce('pending')
      .mockReturnValueOnce('UPS')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-12-31')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      shipments: [{ id: '1', status: 'pending' }],
    });

    const result = await executeShipmentOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      shipments: [{ id: '1', status: 'pending' }],
    });
  });

  it('should get a specific shipment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getShipment')
      .mockReturnValueOnce('shipment123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'shipment123',
      status: 'shipped',
    });

    const result = await executeShipmentOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      id: 'shipment123',
      status: 'shipped',
    });
  });

  it('should create a shipment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createShipment')
      .mockReturnValueOnce({ carrier: 'UPS', tracking_number: '123456' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'new-shipment-123',
      carrier: 'UPS',
      tracking_number: '123456',
    });

    const result = await executeShipmentOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      id: 'new-shipment-123',
      carrier: 'UPS',
      tracking_number: '123456',
    });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getShipment');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeShipmentOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getShipment');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeShipmentOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('API Error');
  });
});

describe('Channel Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.skubana.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all channels successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllChannels')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce('amazon')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(10);

    const mockChannels = [{ id: 'channel1', name: 'Amazon Channel', status: 'active' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockChannels);

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.skubana.com/v1/channels?status=active&type=amazon&page=1&limit=10',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockChannels, pairedItem: { item: 0 } }]);
  });

  it('should get a specific channel successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getChannel')
      .mockReturnValueOnce('channel123');

    const mockChannel = { id: 'channel123', name: 'Test Channel', status: 'active' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockChannel);

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.skubana.com/v1/channels/channel123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockChannel, pairedItem: { item: 0 } }]);
  });

  it('should create a channel successfully', async () => {
    const channelData = { name: 'New Channel', type: 'shopify', config: {} };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createChannel')
      .mockReturnValueOnce(JSON.stringify(channelData));

    const mockCreatedChannel = { id: 'channel456', ...channelData };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCreatedChannel);

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.skubana.com/v1/channels',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: channelData,
      json: true,
    });
    expect(result).toEqual([{ json: mockCreatedChannel, pairedItem: { item: 0 } }]);
  });

  it('should update a channel successfully', async () => {
    const channelData = { name: 'Updated Channel', status: 'inactive' };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateChannel')
      .mockReturnValueOnce('channel123')
      .mockReturnValueOnce(JSON.stringify(channelData));

    const mockUpdatedChannel = { id: 'channel123', ...channelData };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedChannel);

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.skubana.com/v1/channels/channel123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: channelData,
      json: true,
    });
    expect(result).toEqual([{ json: mockUpdatedChannel, pairedItem: { item: 0 } }]);
  });

  it('should sync a channel successfully', async () => {
    const syncOptions = { full_sync: true, sync_orders: true };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('syncChannel')
      .mockReturnValueOnce('channel123')
      .mockReturnValueOnce(JSON.stringify(syncOptions));

    const mockSyncResult = { sync_id: 'sync789', status: 'in_progress' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSyncResult);

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.skubana.com/v1/channels/channel123/sync',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: syncOptions,
      json: true,
    });
    expect(result).toEqual([{ json: mockSyncResult, pairedItem: { item: 0 } }]);
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllChannels');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should continue on fail when configured', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllChannels');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeChannelOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ 
      json: { error: 'API Error' }, 
      pairedItem: { item: 0 } 
    }]);
  });
});
});
