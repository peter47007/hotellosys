
import React, { useState } from 'react';
import { Invoice, InvoiceStatus, Payment, PaymentMethod, Customer, Reservation } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  payments: Payment[];
  customers: Customer[];
  reservations: Reservation[];
  onAddPayment: (payment: Partial<Payment>) => void;
  onUpdateInvoice: (id: string, status: InvoiceStatus) => void;
}

const BillingView: React.FC<BillingViewProps> = ({ 
  invoices, 
  payments, 
  customers, 
  reservations,
  onAddPayment,
  onUpdateInvoice 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'ledger' | 'summary'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getCustomerName = (id: string) => {
    const c = customers.find(cust => cust.id === id);
    return c ? `${c.firstName} ${c.lastName}` : 'Guest';
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch(status) {
      case InvoiceStatus.PAID: return 'bg-emerald-50 text-emerald-600';
      case InvoiceStatus.PARTIALLY_PAID: return 'bg-blue-50 text-blue-600';
      case InvoiceStatus.OVERDUE: return 'bg-red-50 text-red-600';
      case InvoiceStatus.ISSUED: return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Financial Suite</h3>
          <p className="text-slate-500 text-sm">Enterprise billing, revenue collection, and guest settlement.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'invoices', label: 'Invoices', icon: 'fa-file-invoice-dollar' },
            { id: 'ledger', label: 'Payment Ledger', icon: 'fa-receipt' },
            { id: 'summary', label: 'Financial Summary', icon: 'fa-chart-pie' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {activeSubTab === 'invoices' && (
            <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3">
                    <i className="fa-solid fa-magnifying-glass text-slate-300"></i>
                    <input type="text" placeholder="Search Invoices..." className="bg-transparent text-sm font-bold outline-none" />
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                  Manual Folio Entry
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice #</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Paid</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map(inv => (
                      <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv)}
                        className={`hover:bg-slate-50/30 transition-colors cursor-pointer group ${selectedInvoice?.id === inv.id ? 'bg-blue-50/50' : ''}`}
                      >
                        <td className="px-8 py-5">
                          <span className="font-mono text-sm font-bold text-slate-900">{inv.invoiceNumber}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{getCustomerName(inv.customerId)}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Issued: {inv.issueDate.toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="font-black text-slate-900">${inv.totalAmount.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold text-emerald-600">${inv.amountPaid.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-red-500">
                          ${inv.balanceDue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'ledger' && (
            <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Transaction Audit Vault</h4>
              </div>
              <div className="p-8 space-y-6">
                {payments.map(pay => (
                  <div key={pay.id} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all bg-slate-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 text-lg">
                        <i className={`fa-solid ${pay.method === PaymentMethod.CASH ? 'fa-money-bill-1' : 'fa-credit-card'}`}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h5 className="font-bold text-slate-900">Payment {pay.reference}</h5>
                           <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg">{pay.method}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          Processed by {pay.processedBy} • {pay.date.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-emerald-600">+${pay.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedInvoice && (
          <div className="w-full lg:w-[400px] space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="bg-slate-950 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                <i className="fa-solid fa-file-invoice-dollar text-[10rem]"></i>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h4 className="text-4xl font-black">{selectedInvoice.invoiceNumber}</h4>
                    <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{getCustomerName(selectedInvoice.customerId)}</p>
                  </div>
                  <button onClick={() => setSelectedInvoice(null)} className="text-slate-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-times text-2xl"></i>
                  </button>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold opacity-60 uppercase tracking-widest text-[10px]">Total Bill</span>
                      <span className="font-black text-2xl">${selectedInvoice.totalAmount.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="font-bold opacity-60 uppercase tracking-widest text-[10px]">Amount Paid</span>
                      <span className="font-bold text-emerald-400">-${selectedInvoice.amountPaid.toFixed(2)}</span>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="font-black uppercase tracking-widest text-xs text-red-400">Balance Due</span>
                      <span className="text-3xl font-black">${selectedInvoice.balanceDue.toFixed(2)}</span>
                   </div>
                </div>

                {selectedInvoice.balanceDue > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                     <button className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                       Process Settlement
                     </button>
                     <div className="grid grid-cols-2 gap-3">
                        <button className="py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20">Print Statement</button>
                        <button className="py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20">Send via Email</button>
                     </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
               <h5 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-6">Folio Line Items</h5>
               <div className="space-y-4">
                  {selectedInvoice.lineItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-slate-50">
                       <div>
                          <p className="text-sm font-bold text-slate-800 leading-none mb-1">{item.description}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type} • x{item.quantity}</p>
                       </div>
                       <span className="font-black text-slate-900">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between items-center text-slate-900">
                     <span className="text-xs font-black uppercase">Subtotal</span>
                     <span className="font-black">${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                     <span className="text-xs font-bold uppercase">Tax (10%)</span>
                     <span className="font-bold">${selectedInvoice.taxAmount.toFixed(2)}</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingView;
