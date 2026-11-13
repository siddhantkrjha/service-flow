import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { ServiceCategory, BusinessProfile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency } from '@/lib/utils';
import {
  Building,
  Wrench,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Database,
  Shield,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    businessProfile,
    updateBusinessProfile,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetDemoData,
  } = useData();

  // Profile Form state
  const [profileForm, setProfileForm] = useState<BusinessProfile>(businessProfile);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryRate, setCategoryRate] = useState<number>(120);
  const [categoryColor, setCategoryColor] = useState('#0284c7');
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);

  // Demo Reset Confirm
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(profileForm);
  };

  const handleOpenCategoryModal = (cat?: ServiceCategory) => {
    if (cat) {
      setSelectedCategory(cat);
      setCategoryName(cat.name);
      setCategoryDesc(cat.description);
      setCategoryRate(cat.defaultRate);
      setCategoryColor(cat.color);
    } else {
      setSelectedCategory(null);
      setCategoryName('');
      setCategoryDesc('');
      setCategoryRate(125);
      setCategoryColor('#0284c7');
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (selectedCategory) {
      updateCategory(selectedCategory.id, {
        name: categoryName,
        description: categoryDesc,
        defaultRate: categoryRate,
        color: categoryColor,
      });
    } else {
      addCategory({
        name: categoryName,
        description: categoryDesc,
        defaultRate: categoryRate,
        color: categoryColor,
      });
    }
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Platform Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure your service company identity, operational categories, and database connections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Business Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-sky-600" />
                <CardTitle>Business Profile & Branding</CardTitle>
              </div>
              <p className="text-xs text-slate-500">
                This information appears on customer work orders, printouts, and invoices.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business Name *"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Operations Email *"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Business Phone *"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Street Address *"
                    value={profileForm.address.street}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: { ...profileForm.address, street: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="City *"
                    value={profileForm.address.city}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: { ...profileForm.address, city: e.target.value },
                      })
                    }
                    required
                  />
                  <Input
                    label="State *"
                    value={profileForm.address.state}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: { ...profileForm.address, state: e.target.value },
                      })
                    }
                    required
                  />
                  <Input
                    label="ZIP Code *"
                    value={profileForm.address.zip}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: { ...profileForm.address, zip: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <Select
                    label="Operating Currency"
                    value={profileForm.currency}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, currency: e.target.value })
                    }
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </Select>

                  <Select
                    label="Time Zone"
                    value={profileForm.timeZone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, timeZone: e.target.value })
                    }
                  >
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  </Select>

                  <Input
                    label="Default Tax Rate"
                    type="number"
                    step="0.001"
                    value={profileForm.taxRateDefault}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        taxRateDefault: parseFloat(e.target.value) || 0,
                      })
                    }
                    helperText={`Currently ${(profileForm.taxRateDefault * 100).toFixed(2)}%`}
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <Button type="submit" variant="primary">
                    Save Business Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Service Categories Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-sky-600" />
                  <CardTitle>Service Categories & Rates</CardTitle>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define types of work orders, dispatch specialties, and base billing rates
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => handleOpenCategoryModal()}
              >
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <div key={cat.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{cat.name}</div>
                        <div className="text-xs text-slate-500">{cat.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {formatCurrency(cat.defaultRate)}/hr
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Demo State & Database Connectivity */}
        <div className="space-y-6">
          {/* Demo Mode Control Card */}
          <Card className="p-5 border-amber-200 bg-amber-50/20">
            <div className="flex items-center gap-2 mb-2 text-amber-800">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">Demo Mode Management</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              All changes are safely stored in your browser's localStorage. You can test adding,
              editing, and deleting customers, bookings, work orders, and invoices freely.
            </p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => setShowResetConfirm(true)}
              className="w-full text-slate-700 bg-white hover:bg-slate-50 border-slate-300"
            >
              Reset Demo Records
            </Button>
          </Card>

          {/* Supabase Connectivity Card */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-900">
              <Database className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-sm">Supabase Backend Status</h3>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Database Driver:</span>
                <span className="font-mono font-semibold text-slate-800">PostgreSQL (Supabase)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Storage Provider:</span>
                <span className="font-semibold text-emerald-600">Local Browser Demo Storage</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Row Level Security:</span>
                <span className="font-semibold text-sky-700">Multi-tenant Ready</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              To connect your live Supabase database instance, set <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">VITE_SUPABASE_URL</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">VITE_SUPABASE_ANON_KEY</code> in your <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">.env</code> file and execute <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">src/lib/supabase/schema.sql</code>.
            </p>
          </Card>

          {/* Security & Access */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-900">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm">Security & Access Policy</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Service Flow is designed with multi-tenant data isolation. Each business workspace owns
              its isolated rows backed by PostgreSQL RLS security policies.
            </p>
          </Card>
        </div>
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={selectedCategory ? 'Edit Service Category' : 'Add Service Category'}
        maxWidth="md"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <Input
            label="Category Name *"
            placeholder="e.g. Commercial Chiller Maintenance"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />

          <Input
            label="Description"
            placeholder="Brief scope of service for work order dispatch"
            value={categoryDesc}
            onChange={(e) => setCategoryDesc(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Standard Hourly Rate ($)"
              type="number"
              step="5"
              value={categoryRate}
              onChange={(e) => setCategoryRate(parseFloat(e.target.value) || 0)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Badge Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs font-mono text-slate-600">{categoryColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirm */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) deleteCategory(categoryToDelete.id);
        }}
        title="Remove Service Category?"
        message={`Are you sure you want to remove "${categoryToDelete?.name}"?`}
        confirmText="Remove Category"
      />

      {/* Demo Reset Confirm */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetDemoData}
        title="Reset All Demo Data?"
        message="This will re-seed all customers, bookings, work orders, technicians, and invoices back to their realistic initial state."
        confirmText="Reset Everything"
      />
    </div>
  );
};

