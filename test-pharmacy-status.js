const axios = require('axios');

async function testPharmacyOrderStatus() {
  try {
    const response = await axios.put(
      'http://localhost:3000/api/v1/pharmacy/orders/ORD_1764931779548_994/status',
      {
        status: "completed",
        reason: "Some items skipped",
        medicines: [
          {
            medicineId: "6908cae49d564e4d6c2dffed",
            itemStatus: "completed"
          },
          {
            medicineId: "69070bf091b451d45062dc5c",
            itemStatus: "skipped"
          }
        ]
      },
      {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbmlkIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInVzZXJUeXBlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiVXNlciIsImlhdCI6MTc2NDkxMjgzMywiZXhwIjoxNzY0OTk5MjMzfQ.UyWivTIp5NJaoXi8MZs8pm5R40MtGLrOtg08GOlj4uk',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('=== PHARMACY ORDER STATUS UPDATE TEST ===');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    console.log('\n=== ORDER DATA ===');
    console.log('Order ID:', response.data.data.orderId);
    console.log('Final Status:', response.data.data.status);
    console.log('Total Amount:', response.data.data.totalAmount);
    console.log('Reason:', response.data.data.reason);
    console.log('\n=== MEDICINE ITEMS ===');
    response.data.data.items.forEach((item, index) => {
      console.log(`Medicine ${index + 1}:`);
      console.log(`  ID: ${item.medicineId}`);
      console.log(`  Name: ${item.medicineName || item.medicineDetails?.name}`);
      console.log(`  Quantity: ${item.quantity}`);
      console.log(`  Price: $${item.price}`);
      console.log(`  Item Status: ${item.itemStatus}`);
      console.log('');
    });
    
    // Verify expected results
    const completedItems = response.data.data.items.filter(item => item.itemStatus === 'completed');
    const skippedItems = response.data.data.items.filter(item => item.itemStatus === 'skipped');
    const expectedTotal = completedItems.reduce((sum, item) => sum + item.price, 0);
    
    console.log('=== VALIDATION RESULTS ===');
    console.log(`Completed items: ${completedItems.length}`);
    console.log(`Skipped items: ${skippedItems.length}`);
    console.log(`Expected total (completed only): $${expectedTotal}`);
    console.log(`Actual total: $${response.data.data.totalAmount}`);
    console.log(`Status: ${response.data.data.status === 'completed' ? '✅ CORRECT' : '❌ INCORRECT'}`);
    
    if (Math.abs(expectedTotal - response.data.data.totalAmount) < 0.01) {
      console.log('Total amount calculation: ✅ CORRECT');
    } else {
      console.log('Total amount calculation: ❌ INCORRECT');
    }
    
  } catch (error) {
    console.error('Error calling API:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testPharmacyOrderStatus();