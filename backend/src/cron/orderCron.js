const cron = require('node-cron');
const schedulerService = require('../services/schedulerService');

const startCronJob = () => {
  cron.schedule('*/5 * * * *', async () => {
      console.log('🔄 Running scheduled order status update...');
          console.log(`⏰ Time: ${new Date().toLocaleString()}`);
              
                  try {
                        const result = await schedulerService.processOrders();
                              console.log('✅ Scheduler completed successfully');
                                    console.log(`📊 Processed: ${result.ordersProcessed} orders`);
                                          console.log(`🔄 Changed: ${result.statusChanges} statuses`);
                                                console.log(`⏱️  Duration: ${result.duration}ms`);
                                                      
                                                            if (result.errors && result.errors.length > 0) {
                                                                    console.warn(`⚠️ ${result.errors.length} orders had errors`);
                                                                          }
                                                                              } catch (error) {
                                                                                    console.error('❌ Scheduler failed:', error.message);
                                                                                        }
                                                                                          });

                                                                                            console.log('⏰ Cron job scheduled to run every 5 minutes');
                                                                                            };

                                                                                            const startCron = () => {
                                                                                              startCronJob();
                                                                                              };

                                                                                              module.exports = { startCron };