import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, InvoiceStatus, WorkOrder } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => void;
  invoice?: Invoice | null;
  fromWorkOrder?: WorkOrder | null;
}

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  invoice,
  fromWorkOrder,
}) => {
  const { customers, workOrders, businessProfile } = useData();
  const isEditing = Boolean(invoice);

  const [customerId, setCustomerId] = useState('');
  const [workOrderId, setWorkOrderId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15); // Net 15
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<InvoiceStatus>('Sent');
  const [notes, setNotes] = useState('Payment due within 15 days of invoice date. Thank you for your business!');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-init-1',
      description: 'Standard Service Diagnostic & Labor',
      quantity: 1,
      unitPrice: 150.0,
      amount: 150.0,
    },
  ]);

  const taxRate = businessProfile.taxRateDefault || 0.0825;

  useEffect(() => {
    if (invoice) {
      setCustomerId(invoice.customerId);
      setWorkOrderId(invoice.workOrderId || '');
      setIssueDate(invoice.issueDate);
      setDueDate(invoice.dueDate);
      setStatus(invoice.status);
      setNotes(invoice.notes || '');
      setItems(invoice.items);
    } else if (fromWorkOrder) {
      setCustomerId(fromWorkOrder.customerId);
      setWorkOrderId(fromWorkOrder.id);
      setIssueDate(new Date().toISOString().split('T')[0]);
      const d = new Date();
      d.setDate(d.getDate() + 15);
      setDueDate(d.toISOString().split('T')[0]);
      setStatus('Draft');
      setNotes(`Generated for completed Work Order ${fromWorkOrder.orderNumber}.`);
      setItems([
        {
          id: 'item-wo-1',
          description: `${fromWorkOrder.title} - Diagnostic & On-Site Labor`,
          quantity: 2.5,
          unitPrice: 145.0,
          amount: 362.5,
        },
        {
          id: 'item-wo-2',
          description: 'Specialized Service Parts & Consumables',
          quantity: 1,
          unitPrice: 85.0,
          amount: 85.0,
        },
      ]);
    } else {
      setCustomerId(customers[0]?.id || '');
      setWorkOrderId('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      const d = new Date();
      d.setDate(d.getDate() + 15);
      setDueDate(d.toISOString().split('T')[0]);
      setStatus('Sent');
      setNotes('Payment due within 15 days of invoice date. Thank you for your business!');
      setItems([
        {
          id: 'item-init-1',
          description: 'Field Service Labor & Diagnostic',
          quantity: 2,
          unitPrice: 140.0,
          amount: 280.0,
        },
      ]);
    }
  }, [invoice, fromWorkOrder, isOpen, customers]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const current = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      current.amount = Number(current.quantity || 0) * Number(current.unitPrice || 0);
    }
    newItems[index] = current;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    onSubmit({
      customerId,
      workOrderId: workOrderId || undefined,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Invoice: ${invoice?.invoiceNumber}` : 'Create New Invoice'}
      description="Add line items, customer account, and due date"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Customer Account *"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select a customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </Select>

          <Select
            label="Link to Completed Work Order"
            value={workOrderId}
            onChange={(e) => setWorkOrderId(e.target.value)}
          >
            <option value="">None / Standalone Invoice</option>
            {workOrders.map((wo) => (
              <option key={wo.id} value={wo.id}>
                {wo.orderNumber} - {wo.title.slice(0, 30)}...
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Issue Date *"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />

          <Input
            label="Due Date *"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <Select
            label="Invoice Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent (Awaiting Payment)</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>

        {/* Line Items Table */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Invoice Line Items
            </h4>
            <Button
              type="button"
              variant="outline"
              size="xs"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={addItem}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Item description / service detail"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="flex-1 h-9 rounded-lg border border-slate-300 px-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="0.1"
                  step="0.5"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-16 h-9 rounded-lg border border-slate-300 px-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none text-right"
                  required
                />
                <input
                  type="number"
                  placeholder="Rate"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-24 h-9 rounded-lg border border-slate-300 px-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none text-right"
                  required
                />
                <div className="w-24 text-right text-xs font-bold text-slate-900 px-2">
                  {formatCurrency(item.amount)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation summary */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax ({(taxRate * 100).toFixed(2)}%):</span>
              <span className="font-semibold text-slate-900">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Amount:</span>
              <span className="text-sky-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <Textarea
          label="Payment Terms & Remittance Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

