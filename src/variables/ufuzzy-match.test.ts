import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import model from './ufuzzy-match';

describe('ufuzzyMatch variable evaluator', () => {
    let mockTrigger: Effects.Trigger;

    beforeEach(() => {
        mockTrigger = {} as Effects.Trigger;
    });

    describe('fuzzy search functionality', () => {
        it('should find fuzzy match in config files with partial query', () => {
            const searchArray = [
                'app-config',
                'database-settings',
                'user-preferences',
                'system-config',
                'network-settings',
                'auth-config',
                'cache-settings'
            ];

            const result = model.evaluator(mockTrigger, 'app', searchArray);
            expect(result).toBe('app-config');
        });

        it('should match development environment files with typos', () => {
            const searchArray = [
                'dev-environment',
                'prod-environment',
                'test-environment',
                'staging-environment',
                'local-development',
                'build-scripts',
                'deploy-configs',
                'docker-compose',
                'env-variables'
            ];

            const result = model.evaluator(mockTrigger, 'developmnt', searchArray);
            expect(result).toBe('local-development');
        });

        it('should find best match in component files with word search', () => {
            const searchArray = [
                'user-profile-component',
                'navigation-bar-component',
                'footer-section-component',
                'header-main-component',
                'sidebar-menu-component',
                'content-area-component',
                'modal-dialog-component',
                'button-primary-component',
                'input-field-component',
                'dropdown-select-component',
                'card-layout-component'
            ];

            const result = model.evaluator(mockTrigger, 'profile', searchArray);
            expect(result).toBe('user-profile-component');
        });

        it('should match test files with underscores', () => {
            const searchArray = [
                'user_authentication_test',
                'database_connection_test',
                'api_endpoint_test',
                'file_upload_test',
                'email_service_test',
                'payment_processing_test',
                'search_functionality_test',
                'notification_system_test',
                'cache_management_test',
                'session_handling_test',
                'data_validation_test',
                'security_check_test'
            ];

            const result = model.evaluator(mockTrigger, 'upload', searchArray);
            expect(result).toBe('file_upload_test');
        });

        it('should find utility scripts with mixed separators', () => {
            const searchArray = [
                'backup-database_script',
                'clean-temp_files',
                'generate-reports_util',
                'sync-data_backup',
                'migrate-schema_tool',
                'check-health_monitor',
                'update-dependencies_script',
                'compress-assets_util',
                'validate-config_checker'
            ];

            const result = model.evaluator(mockTrigger, 'reports', searchArray);
            expect(result).toBe('generate-reports_util');
        });

        it('should match middleware files with character transposition', () => {
            const searchArray = [
                'authentication-middleware',
                'authorization-middleware',
                'logging-middleware',
                'error-handling-middleware',
                'rate-limiting-middleware',
                'cors-middleware',
                'compression-middleware',
                'security-headers-middleware',
                'request-validation-middleware',
                'response-caching-middleware',
                'api-versioning-middleware',
                'request-logging-middleware',
                'session-management-middleware'
            ];

            const result = model.evaluator(mockTrigger, 'autentication', searchArray);
            expect(result).toBe('authentication-middleware');
        });

        it('should find model files with word abbreviation', () => {
            const searchArray = [
                'user_account',
                'product_catalog',
                'order_history',
                'payment_method',
                'shipping_address',
                'customer_profile',
                'inventory_item',
                'category_tag',
                'review_rating',
                'discount_coupon',
                'notification_preference',
                'subscription_plan',
                'support_ticket',
                'analytics_data'
            ];

            const result = model.evaluator(mockTrigger, 'customer', searchArray);
            expect(result).toBe('customer_profile');
        });

        it('should match service files with partial word', () => {
            const searchArray = [
                'email-notification-service',
                'payment-processing-service',
                'file-storage-service',
                'image-resize-service',
                'pdf-generation-service',
                'sms-notification-service',
                'backup-restore-service',
                'data-export-service',
                'report-generation-service',
                'audit-logging-service',
                'cache-invalidation-service',
                'search-indexing-service',
                'webhook-delivery-service',
                'content-moderation-service',
                'translation-service'
            ];

            const result = model.evaluator(mockTrigger, 'email', searchArray);
            expect(result).toBe('email-notification-service');
        });

        it('should find controller files with abbreviated terms', () => {
            const searchArray = [
                'user-management-controller',
                'product-catalog-controller',
                'order-processing-controller',
                'payment-gateway-controller',
                'inventory-tracking-controller',
                'customer-support-controller',
                'analytics-dashboard-controller',
                'content-management-controller',
                'notification-center-controller',
                'settings-configuration-controller',
                'security-audit-controller',
                'backup-management-controller',
                'integration-webhook-controller',
                'monitoring-health-controller',
                'deployment-pipeline-controller',
                'api-gateway-controller'
            ];

            const result = model.evaluator(mockTrigger, 'gateway', searchArray);
            expect(result).toBe('api-gateway-controller');
        });

        it('should match library files with fuzzy search', () => {
            const searchArray = [
                'string-utilities',
                'date-helpers',
                'validation-rules',
                'encryption-tools',
                'file-operations',
                'network-requests',
                'image-processing',
                'text-formatting',
                'data-structures',
                'algorithm-helpers',
                'crypto-functions',
                'parser-utilities'
            ];

            const result = model.evaluator(mockTrigger, 'validation', searchArray);
            expect(result).toBe('validation-rules');
        });
    });

    describe('single word arrays with similar words', () => {
        it('should find exact match among numbered variants', () => {
            const searchArray = [
                'config',
                'config1',
                'config2',
                'config3',
                'settings',
                'options'
            ];

            const result = model.evaluator(mockTrigger, 'config', searchArray);
            expect(result).toBe('config');
        });

        it('should match numbered variant with partial query', () => {
            const searchArray = [
                'backup',
                'backup1',
                'backup2',
                'restore',
                'archive',
                'snapshot'
            ];

            const result = model.evaluator(mockTrigger, 'backup2', searchArray);
            expect(result).toBe('backup2');
        });

        it('should find best match with typo in numbered words', () => {
            const searchArray = [
                'version',
                'version1',
                'version2',
                'version3',
                'release',
                'build',
                'deploy'
            ];

            const result = model.evaluator(mockTrigger, 'versio', searchArray);
            expect(result).toBe('version');
        });

        it('should match similar words with different endings', () => {
            const searchArray = [
                'test',
                'testing',
                'tester',
                'tests',
                'spec',
                'check',
                'verify'
            ];

            const result = model.evaluator(mockTrigger, 'test', searchArray);
            expect(result).toBe('test');
        });

        it('should find numbered file among similar base names', () => {
            const searchArray = [
                'somelog',
                'somelog1',
                'somelog2',
                'somelog3',
                'somelog4',
                'debug',
                'trace',
                'error',
                'info',
                'warn'
            ];

            const result = model.evaluator(mockTrigger, 'log3', searchArray);
            expect(result).toBe('somelog3');
        });

        it('should match word with similar variants and numbers', () => {
            const searchArray = [
                'data',
                'data1',
                'data2',
                'database',
                'dataset',
                'info',
                'content',
                'input'
            ];

            const result = model.evaluator(mockTrigger, 'ata', searchArray);
            expect(result).toBe('data');
        });

        it('should find best match with transposed characters in numbered words', () => {
            const searchArray = [
                'server',
                'server1',
                'server2',
                'client',
                'service',
                'proxy',
                'worker'
            ];

            const result = model.evaluator(mockTrigger, 'sever1', searchArray);
            expect(result).toBe('server1');
        });

        it('should match partial word with multiple numbered options', () => {
            const searchArray = [
                'user',
                'user1',
                'user2',
                'user3',
                'admin',
                'guest',
                'member',
                'visitor',
                'owner'
            ];

            const result = model.evaluator(mockTrigger, 'gest', searchArray);
            expect(result).toBe('guest');
        });

        it('should match partial typo word with multiple numbered options', () => {
            const searchArray = [
                'user',
                'user1',
                'user2',
                'user3',
                'admin',
                'guest',
                'member',
                'visitor',
                'owner'
            ];

            const result = model.evaluator(mockTrigger, 'dim', searchArray);
            expect(result).toBe('admin');
        });

        it('should find numbered word with fuzzy abbreviation', () => {
            const searchArray = [
                'application',
                'app',
                'app1',
                'app2',
                'program',
                'software',
                'tool',
                'utility'
            ];

            const result = model.evaluator(mockTrigger, 'app1', searchArray);
            expect(result).toBe('app1');
        });

        it('should match similar words with different number suffixes', () => {
            const searchArray = [
                'temp',
                'temp1',
                'temp2',
                'temp10',
                'temp11',
                'temporary',
                'cache',
                'buffer',
                'storage'
            ];

            const result = model.evaluator(mockTrigger, 'temp10', searchArray);
            expect(result).toBe('temp10');
        });

        it('should match the phasmophobia sound', () => {
            const searchArray = [
                'breath',
                'breath2',
                'breath3',
                'crucifix',
                'death'
            ];

            const result = model.evaluator(mockTrigger, 'cruci', searchArray);
            expect(result).toBe('crucifix');
        });
    });

    describe('substring match fallback', () => {
        it('should use substring match for queries longer than 25 characters', () => {
            const searchArray = [
                'very-long-configuration-file-name-with-many-words',
                'another-extremely-long-filename-that-exceeds-normal-length',
                'short-config',
                'medium-length-filename',
                'ultra-mega-super-duper-long-configuration-file-name-that-is-really-really-long'
            ];

            const longQuery = 'very-long-configuration-file'; // This will trigger substring match due to length
            const result = model.evaluator(mockTrigger, longQuery, searchArray);
            expect(result).toBe('very-long-configuration-file-name-with-many-words');
        });

        it('should use substring match for queries with only symbols', () => {
            const searchArray = [
                'file-with-symbols-!@#$%',
                'normal-filename',
                'another-file-with-&*()+=',
                'test-file-{|}[]',
                'config-file'
            ];

            const symbolQuery = '!@#$%'; // Only symbols should trigger substring match
            const result = model.evaluator(mockTrigger, symbolQuery, searchArray);
            expect(result).toBe('file-with-symbols-!@#$%');
        });

        it('should use substring match for queries with non-ASCII characters', () => {
            const searchArray = [
                'файл-конфигурации',
                'normal-config',
                'español-archivo',
                'français-fichier',
                'test-file'
            ];

            const nonAsciiQuery = 'файл'; // Cyrillic characters should trigger substring match
            const result = model.evaluator(mockTrigger, nonAsciiQuery, searchArray);
            expect(result).toBe('файл-конфигурации');
        });

        it('should use substring match for queries with many terms (more than 5)', () => {
            const searchArray = [
                'one-two-three-four-five-six-seven-eight-nine-ten',
                'short-file',
                'medium-length-file-name',
                'another-very-long-multi-word-file-name-with-many-segments',
                'test-config'
            ];

            const manyTermsQuery = 'one-two-three-four-five-six'; // More than 5 terms should trigger substring match
            const result = model.evaluator(mockTrigger, manyTermsQuery, searchArray);
            expect(result).toBe('one-two-three-four-five-six-seven-eight-nine-ten');
        });

        it('should use substring match for mixed special characters and symbols', () => {
            const searchArray = [
                'log-file-[2024-09-18].txt',
                'backup-{database}.sql',
                'config-(production).json',
                'normal-file.txt',
                'test-file.log'
            ];

            const mixedQuery = '[2024-09-18]'; // Brackets and numbers should trigger substring match
            const result = model.evaluator(mockTrigger, mixedQuery, searchArray);
            expect(result).toBe('log-file-[2024-09-18].txt');
        });

        it('should use substring match for queries with regex special characters', () => {
            const searchArray = [
                'file-with-regex-.*+?{}()[]|^$',
                'normal-filename',
                'test-(group).txt',
                'config-[array].json',
                'simple-file'
            ];

            const regexQuery = '.*+?'; // Regex special characters should be escaped and matched as substring
            const result = model.evaluator(mockTrigger, regexQuery, searchArray);
            expect(result).toBe('file-with-regex-.*+?{}()[]|^$');
        });

        it('should return empty string when substring match finds no results', () => {
            const searchArray = [
                'normal-file',
                'test-config',
                'sample-data',
                'backup-script'
            ];

            const noMatchQuery = '!@#$%^&*()'; // Symbols that should not match any file
            const result = model.evaluator(mockTrigger, noMatchQuery, searchArray);
            expect(result).toBe('');
        });

        it('should use substring match for queries with unicode emoji', () => {
            const searchArray = [
                'readme-📝-file',
                'config-⚙️-settings',
                'normal-file',
                'test-🧪-results',
                'backup-💾-data'
            ];

            const emojiQuery = '📝'; // Unicode emoji should trigger substring match
            const result = model.evaluator(mockTrigger, emojiQuery, searchArray);
            expect(result).toBe('readme-📝-file');
        });

        it('should use substring match for very long queries with spaces', () => {
            const searchArray = [
                'this is a very long filename with many words that exceeds the normal character limit',
                'short file',
                'medium length filename',
                'another extremely long filename that should trigger substring matching behavior'
            ];

            const longSpacedQuery = 'very long filename with many words'; // Long query with spaces
            const result = model.evaluator(mockTrigger, longSpacedQuery, searchArray);
            expect(result).toBe('this is a very long filename with many words that exceeds the normal character limit');
        });

        it('should use substring match for queries with punctuation and special formatting', () => {
            const searchArray = [
                'file_name.config.json',
                'app-settings.xml',
                'database.connection.properties',
                'user-preferences.ini',
                'system.log.backup'
            ];

            const punctuationQuery = '.config.'; // Dots and special formatting
            const result = model.evaluator(mockTrigger, punctuationQuery, searchArray);
            expect(result).toBe('file_name.config.json');
        });
    });
});
