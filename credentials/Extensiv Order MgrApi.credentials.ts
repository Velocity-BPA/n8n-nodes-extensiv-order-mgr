import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ExtensivOrderMgrApi implements ICredentialType {
	name = 'extensivOrderMgrApi';
	displayName = 'Extensiv Order Mgr API';
	documentationUrl = 'https://docs.skubana.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for Extensiv Order Manager. Generate in Settings > Integrations > API Keys.',
			required: true,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.skubana.com/v1',
			description: 'Base URL for the Extensiv Order Manager API',
			required: true,
		},
	];
}