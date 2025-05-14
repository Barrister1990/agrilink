import {
  AlertTriangle,
  Bell,
  Check,
  CreditCard,
  Database,
  Globe,
  Key,
  RefreshCw,
  Save,
  Shield,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import SuperAdminLayout from './layout';

export default function SettingsPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('General');
  
  // State for form values
  const [settings, setSettings] = useState({
    platformName: 'Farm to Table Direct',
    supportEmail: 'support@farmtotabledirect.com',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    features: {
      enableFarmerReviews: true,
      enableGroupOrders: true,
      enableSubscriptionService: false,
      enableWaitlists: true
    },
    apiKey: '•••••••••••••••••••••••',
    webhookUrl: 'https://example.com/webhooks/farm-to-table',
    apiVersion: 'v2',
    maintenanceMode: false
  });

  // State for notifications
  const [notification, setNotification] = useState(null);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  // Handle feature toggle
  const handleFeatureToggle = (featureName) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [featureName]: !settings.features[featureName]
      }
    });
  };

  // Handle save changes
  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showNotification('Settings saved successfully', 'success');
    }, 800);
  };

  // Handle regenerate API key
  const handleRegenerateApiKey = () => {
    const newApiKey = Array(24)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    
    setSettings({
      ...settings,
      apiKey: newApiKey
    });
    
    showNotification('API key regenerated successfully', 'success');
  };

  // Toggle maintenance mode
  const toggleMaintenanceMode = () => {
    if (!settings.maintenanceMode) {
      // Confirm before enabling
      if (window.confirm('Are you sure you want to enable maintenance mode? This will prevent users from accessing the platform.')) {
        setSettings({
          ...settings,
          maintenanceMode: true
        });
        showNotification('Maintenance mode enabled', 'warning');
      }
    } else {
      setSettings({
        ...settings,
        maintenanceMode: false
      });
      showNotification('Maintenance mode disabled', 'success');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Navigation items
  const navigationItems = [
    { name: 'General', icon: Globe },
    { name: 'Security', icon: Shield },
    { name: 'Admin Users', icon: Users },
    { name: 'Notifications', icon: Bell },
    { name: 'Billing', icon: CreditCard },
    { name: 'System', icon: Database },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Manage platform preferences and configurations</p>
          </div>
          <button 
            className={`
              inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
              ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            `}
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`
            fixed top-4 right-4 max-w-sm bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50
            ${notification.type === 'success' ? 'border-l-4 border-green-500' : ''}
            ${notification.type === 'warning' ? 'border-l-4 border-yellow-500' : ''}
            ${notification.type === 'error' ? 'border-l-4 border-red-500' : ''}
          `}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <Check className="h-5 w-5 text-green-500" />}
                  {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  {notification.type === 'error' && <X className="h-5 w-5 text-red-500" />}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="inline-flex text-gray-400 hover:text-gray-500"
                    onClick={() => setNotification(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  className={`
                    flex items-center py-4 px-6 border-b-2 text-sm font-medium
                    ${activeTab === item.name
                      ? 'border-green-500 text-green-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  onClick={() => setActiveTab(item.name)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {activeTab === 'General' && (
              <div className="space-y-8">
                {/* Platform Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="platformName" className="block text-sm font-medium text-gray-700">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        name="platformName"
                        id="platformName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={settings.platformName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                        Support Email
                      </label>
                      <input
                        type="email"
                        name="supportEmail"
                        id="supportEmail"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={settings.supportEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                        Default Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        value={settings.timezone}
                        onChange={handleInputChange}
                      >
                        <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        <option value="America/Denver">Mountain Time (US & Canada)</option>
                        <option value="America/Chicago">Central Time (US & Canada)</option>
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Default Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        value={settings.currency}
                        onChange={handleInputChange}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Features Toggles */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Settings</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'enableFarmerReviews', name: 'Enable Farmer Reviews', description: 'Allow customers to leave reviews for farmers' },
                      { key: 'enableGroupOrders', name: 'Enable Group Orders', description: 'Allow customers to create group orders with friends and neighbors' },
                      { key: 'enableSubscriptionService', name: 'Enable Subscription Service', description: 'Enable recurring subscription orders for customers' },
                      { key: 'enableWaitlists', name: 'Enable Waitlists', description: 'Enable product waitlists for out-of-stock items' },
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className={`
                              relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                              transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                              ${settings.features[feature.key] ? 'bg-green-500' : 'bg-gray-200'}
                            `}
                            role="switch"
                            aria-checked={settings.features[feature.key]}
                            onClick={() => handleFeatureToggle(feature.key)}
                          >
                            <span
                              aria-hidden="true"
                              className={`
                                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                                transition ease-in-out duration-200
                                ${settings.features[feature.key] ? 'translate-x-5' : 'translate-x-0'}
                              `}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* API Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Key className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">API Key</p>
                        <p className="text-sm text-gray-500 font-mono">{settings.apiKey}</p>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={handleRegenerateApiKey}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                        Webhook URL
                      </label>
                      <input
                        type="text"
                        name="webhookUrl"
                        id="webhookUrl"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={settings.webhookUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="apiVersion" className="block text-sm font-medium text-gray-700">
                        API Version
                      </label>
                      <select
                        id="apiVersion"
                        name="apiVersion"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        value={settings.apiVersion}
                        onChange={handleInputChange}
                      >
                        <option value="v1">Version 1 (Legacy)</option>
                        <option value="v2">Version 2 (Current)</option>
                        <option value="v3-beta">Version 3 (Beta)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Maintenance Mode */}
                <div className={`border rounded-lg p-4 ${settings.maintenanceMode ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className={`h-5 w-5 ${settings.maintenanceMode ? 'text-red-400' : 'text-yellow-400'}`} />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <div>
                        <h3 className={`text-sm font-medium ${settings.maintenanceMode ? 'text-red-800' : 'text-yellow-800'}`}>
                          Maintenance Mode {settings.maintenanceMode ? '(Enabled)' : ''}
                        </h3>
                        <div className={`mt-2 text-sm ${settings.maintenanceMode ? 'text-red-700' : 'text-yellow-700'}`}>
                          <p>
                            When enabled, the platform will display a maintenance page to all non-admin users.
                            Only super admins will be able to access the platform.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <button
                          type="button"
                          className={`
                            inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${settings.maintenanceMode 
                              ? 'border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500' 
                              : 'border-yellow-300 text-yellow-700 bg-white hover:bg-yellow-50 focus:ring-yellow-500'}
                          `}
                          onClick={toggleMaintenanceMode}
                        >
                          {settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="text-gray-500">Configure security settings, authentication methods, and password policies.</p>
                <div className="bg-gray-50 p-6 rounded-md text-center">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">This tab is under development</p>
                </div>
              </div>
            )}

            {activeTab === 'Admin Users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Admin User Management</h3>
                <p className="text-gray-500">Manage administrator accounts and permissions.</p>
                <div className="bg-gray-50 p-6 rounded-md text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Admin User Management</h3>
                  <p className="mt-1 text-sm text-gray-500">This tab is under development</p>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="text-gray-500">Configure system notifications, alerts, and message templates.</p>
                <div className="bg-gray-50 p-6 rounded-md text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Notification Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">This tab is under development</p>
                </div>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Billing Settings</h3>
                <p className="text-gray-500">Configure payment methods, billing cycles, and subscription plans.</p>
                <div className="bg-gray-50 p-6 rounded-md text-center">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Billing Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">This tab is under development</p>
                </div>
              </div>
            )}

            {activeTab === 'System' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
                <p className="text-gray-500">View system information and configure advanced settings.</p>
                
                {/* System Information */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Version</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">v2.4.1</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">April 28, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Server Status</p>
                      <p className="mt-1 text-sm font-medium flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-green-600">Operational</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Database Status</p>
                      <p className="mt-1 text-sm font-medium flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-green-600">Healthy</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* System Actions */}
                  <div className="mt-6 space-y-4">
                    <h4 className="text-md font-medium text-gray-900">System Actions</h4>
                    <div className="space-x-4">
                      <button 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => showNotification('System cache cleared successfully', 'success')}
                      >
                        Clear System Cache
                      </button>
                      <button 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => showNotification('Log files downloaded', 'success')}
                      >
                        Download Log Files
                      </button>
                      <button 
                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to restart the server? This will temporarily disconnect all users.')) {
                            showNotification('Server restart initiated', 'warning');
                          }
                        }}
                      >
                        Restart Server
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}