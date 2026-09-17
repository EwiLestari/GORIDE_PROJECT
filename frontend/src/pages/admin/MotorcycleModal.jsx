/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check } from 'lucide-react';

export const MotorcycleModal = ({ isOpen, onClose, onSave, initialData }) => {
  const categories = [
    { id: '2cadedbb-178c-4918-a4a4-28bd27c3fa23', name: 'Matic' },
    { id: 'e490f5fe-396a-40df-b725-85e0821caaa7', name: 'Manual' },
    { id: 'e0853089-4fc9-45b4-9c70-c1bcbb6df3f4', name: 'Sport' }
  ];

  const defaultFormData = {
    brand: '',
    name: '',
    category_id: categories[0].id,
    license_plate: '',
    cc: '',
    color: '',
    price_per_day: '',
    stock: '',
    status: 'available',
    description: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          brand: initialData.brand || '',
          name: initialData.name || '',
          category_id: initialData.category_id || categories[0].id,
          license_plate: initialData.license_plate || '',
          cc: initialData.cc || '',
          color: initialData.color || '',
          price_per_day: initialData.price_per_day || '',
          stock: initialData.stock || '',
          status: initialData.status || 'available',
          description: initialData.description || ''
        });
        setImagePreview(initialData.image_url || '');
        setImageFile(null);
      } else {
        setFormData(defaultFormData);
        setImagePreview('');
        setImageFile(null);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      } else if (initialData?.image_url && !imageFile) {
        // Keep the old image URL
        data.append('image_url', initialData.image_url);
      }

      await onSave(data, initialData?.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-bg-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
            <h3 className="text-2xl font-bold font-['Outfit']">{initialData ? 'Edit Motorcycle' : 'Add New Motorcycle'}</h3>
            <button onClick={onClose} type="button" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="motorcycle-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all relative overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-medium flex items-center gap-2"><Upload size={18}/> Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-primary transition-colors">
                      <Upload className="w-8 h-8 mb-3" />
                      <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Brand</label>
                  <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Honda" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Model Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Vario 160" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">License Plate</label>
                  <input required type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. D 1234 ABC" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Engine CC</label>
                  <input required type="number" name="cc" value={formData.cc} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. 160" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Color</label>
                  <input required type="text" name="color" value={formData.color} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Matte Black" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Price / Day (Rp)</label>
                  <input required type="number" name="price_per_day" value={formData.price_per_day} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. 150000" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Stock</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none">
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter description..." />
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-medium transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              form="motorcycle-form"
              disabled={isSubmitting}
              className="btn btn-primary px-8 py-2 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Check size={18} /> {initialData ? 'Save Changes' : 'Create Motorcycle'}</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
