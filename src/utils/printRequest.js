export function printRequestToOrder(request, userId = null) {
  const quantity = Number(request.quantity) || 1;
  const subtotal = Number(request.estimatedCost) || 0;
  const discountAmount = Number(request.discountAmount) || 0;
  const deliveryFee = Number(request.fulfillmentFee) || 0;
  const fulfillment = request.fulfillment === 'delivery' ? 'delivery' : 'pickup';
  return {
    id: request.id,
    date: request.date,
    userId,
    customer: { name: request.clientName, email: request.clientEmail || '', phone: request.clientPhone || '', type: 'Print Customer' },
    fulfillment,
    pickupLocation: request.pickupLocation || 'Purok 5, Banago, Nagcarlan Main Branch — Counter 2',
    pickupTimeSlot: request.pickupTimeSlot || '',
    deliveryAddress: request.deliveryAddress || '',
    deliveryFee,
    paymentMethod: request.paymentMethod || (fulfillment === 'delivery' ? 'GCash (E-Wallet)' : 'Cash on Pickup'),
    status: request.status === 'Completed' || request.status === 'Ready for Pickup' || request.status === 'Cancelled'
      ? request.status
      : request.status === 'Approved & Printing' || request.status === 'Processing'
        ? 'Processing' : 'Order Placed',
    orderType: 'printing',
    subtotal: Number(request.cartSubtotal || 0) + subtotal,
    discountAmount,
    appliedPromoCode: request.appliedPromoCode || null,
    total: Math.max(0, Number(request.cartSubtotal || 0) + subtotal - discountAmount) + deliveryFee,
    notes: request.notes || '',
    attachedFileName: request.attachedFileName || '',
    attachedFileDataUrl: request.attachedFileDataUrl || '',
    items: [{
      id: `print-service-${request.id}`,
      name: `Print Request: ${request.serviceType} — ${request.pageCount} pages, ${request.paperType}, ${request.bindingDetails}`,
      price: subtotal / quantity,
      quantity,
      sku: 'PRINT-SERVICE',
      attachedFileName: request.attachedFileName || '',
      attachedFileDataUrl: request.attachedFileDataUrl || ''
    }]
  };
}
