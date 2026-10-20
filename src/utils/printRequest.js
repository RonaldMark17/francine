export function printRequestToOrder(request, userId = null) {
  const quantity = Number(request.quantity) || 1;
  const total = Number(request.estimatedCost) || 0;
  return {
    id: request.id,
    date: request.date,
    userId,
    customer: { name: request.clientName, email: request.clientEmail || '', phone: request.clientPhone || '', type: 'Print Customer' },
    fulfillment: 'pickup',
    paymentMethod: 'Cash on Pickup',
    status: request.status === 'Completed' || request.status === 'Ready for Pickup' ? request.status
      : request.status === 'Approved & Printing' ? 'Processing' : 'Order Placed',
    subtotal: total,
    total,
    notes: [request.notes, request.attachedFileName && `File: ${request.attachedFileName}`].filter(Boolean).join('\n'),
    items: [{
      id: `print-service-${request.id}`,
      name: `Print Request: ${request.serviceType} — ${request.pageCount} pages, ${request.paperType}, ${request.bindingDetails}`,
      price: total / quantity,
      quantity,
      sku: 'PRINT-SERVICE'
    }]
  };
}
