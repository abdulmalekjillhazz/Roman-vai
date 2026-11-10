import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Save, Building2, Phone, MapPin, Clock, Share2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BusinessProfilePanel({ businessProfileManager }) {
  const {
    form,
    saving,
    msg,
    error,
    handleFieldChange,
    handleSocialChange,
    handleFileChange,
    saveProfile
  } = businessProfileManager;

  const [openSections, setOpenSections] = useState({
    brand: true,
    contact: true,
    address: true,
    hours: false,
    socials: false,
    media: false
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-brand-sand p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal">Business Profile & Verification</h2>
            <p className="text-xs text-brand-muted mt-1">Manage company details, contact channels, showroom addresses, and trust assets.</p>
          </div>
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-bold font-sans uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50 transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>

        {msg && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={saveProfile} className="mt-6 space-y-4">
          {/* Section: Brand & Story */}
          <div className="border border-brand-sand rounded-xl overflow-hidden bg-brand-cream/10">
            <button
              type="button"
              onClick={() => toggleSection('brand')}
              className="w-full flex items-center justify-between p-4 bg-brand-cream/40 hover:bg-brand-cream/60 transition text-left"
            >
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-charcoal">
                <Building2 className="w-4 h-4 text-brand-gold" />
                <span>Brand & Identity</span>
              </div>
              {openSections.brand ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
            </button>

            {openSections.brand && (
              <div className="p-4 sm:p-6 space-y-4 bg-white border-t border-brand-sand">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Display Name</label>
                    <input
                      type="text"
                      value={form.displayName || ''}
                      onChange={e => handleFieldChange('displayName', e.target.value)}
                      placeholder="e.g. Classical Decor ID"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Legal Entity Name</label>
                    <input
                      type="text"
                      value={form.legalName || ''}
                      onChange={e => handleFieldChange('legalName', e.target.value)}
                      placeholder="Registered LLC or trade license name"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Company Introduction</label>
                  <textarea
                    rows={3}
                    value={form.introduction || ''}
                    onChange={e => handleFieldChange('introduction', e.target.value)}
                    placeholder="Brief architectural material supply and interior decor summary..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Company History & Heritage</label>
                    <textarea
                      rows={2}
                      value={form.history || ''}
                      onChange={e => handleFieldChange('history', e.target.value)}
                      placeholder="Establishment background..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Mission & Values</label>
                    <textarea
                      rows={2}
                      value={form.missionValues || ''}
                      onChange={e => handleFieldChange('missionValues', e.target.value)}
                      placeholder="Quality, durability, client partnership..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contact */}
          <div className="border border-brand-sand rounded-xl overflow-hidden bg-brand-cream/10">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between p-4 bg-brand-cream/40 hover:bg-brand-cream/60 transition text-left"
            >
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-charcoal">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>Contact Channels</span>
              </div>
              {openSections.contact ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
            </button>

            {openSections.contact && (
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border-t border-brand-sand">
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={form.contactPhone || ''}
                    onChange={e => handleFieldChange('contactPhone', e.target.value)}
                    placeholder="+971 54 353 2585"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={form.whatsappNumber || ''}
                    onChange={e => handleFieldChange('whatsappNumber', e.target.value)}
                    placeholder="+971 54 353 2585"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Official Email</label>
                  <input
                    type="email"
                    value={form.contactEmail || ''}
                    onChange={e => handleFieldChange('contactEmail', e.target.value)}
                    placeholder="info@classicaldecorid.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Address & Coverage */}
          <div className="border border-brand-sand rounded-xl overflow-hidden bg-brand-cream/10">
            <button
              type="button"
              onClick={() => toggleSection('address')}
              className="w-full flex items-center justify-between p-4 bg-brand-cream/40 hover:bg-brand-cream/60 transition text-left"
            >
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-charcoal">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Showroom, Office & Coverage</span>
              </div>
              {openSections.address ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
            </button>

            {openSections.address && (
              <div className="p-4 sm:p-6 space-y-4 bg-white border-t border-brand-sand">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Showroom Address</label>
                    <input
                      type="text"
                      value={form.showroomAddress || ''}
                      onChange={e => handleFieldChange('showroomAddress', e.target.value)}
                      placeholder="Showroom location in Dubai..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Registered Office Address</label>
                    <input
                      type="text"
                      value={form.officeAddress || ''}
                      onChange={e => handleFieldChange('officeAddress', e.target.value)}
                      placeholder="Main office or warehouse address..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={form.googleMapsUrl || ''}
                      onChange={e => handleFieldChange('googleMapsUrl', e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Service Areas (one per line)</label>
                    <textarea
                      rows={2}
                      value={form.serviceAreas || ''}
                      onChange={e => handleFieldChange('serviceAreas', e.target.value)}
                      placeholder="Dubai&#10;Abu Dhabi&#10;Sharjah&#10;Ajman"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Hours & Registration */}
          <div className="border border-brand-sand rounded-xl overflow-hidden bg-brand-cream/10">
            <button
              type="button"
              onClick={() => toggleSection('hours')}
              className="w-full flex items-center justify-between p-4 bg-brand-cream/40 hover:bg-brand-cream/60 transition text-left"
            >
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-charcoal">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>Operating Hours & License</span>
              </div>
              {openSections.hours ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
            </button>

            {openSections.hours && (
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-t border-brand-sand">
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={form.operatingHours || ''}
                    onChange={e => handleFieldChange('operatingHours', e.target.value)}
                    placeholder="e.g. Sat – Thu: 8:00 AM – 7:00 PM | Friday: Closed"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Commercial Registration / License Details</label>
                  <input
                    type="text"
                    value={form.registrationDetails || ''}
                    onChange={e => handleFieldChange('registrationDetails', e.target.value)}
                    placeholder="e.g. DED Trade License No. 123456"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Socials */}
          <div className="border border-brand-sand rounded-xl overflow-hidden bg-brand-cream/10">
            <button
              type="button"
              onClick={() => toggleSection('socials')}
              className="w-full flex items-center justify-between p-4 bg-brand-cream/40 hover:bg-brand-cream/60 transition text-left"
            >
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-charcoal">
                <Share2 className="w-4 h-4 text-brand-gold" />
                <span>Social Media Channels</span>
              </div>
              {openSections.socials ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
            </button>

            {openSections.socials && (
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border-t border-brand-sand">
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={form.socials?.instagramUrl || ''}
                    onChange={e => handleSocialChange('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={form.socials?.facebookUrl || ''}
                    onChange={e => handleSocialChange('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={form.socials?.linkedinUrl || ''}
                    onChange={e => handleSocialChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Media & Documents */}
          <div className="border border-brand-sand rounded-xl overflow-hidden bg-brand-cream/10">
            <button
              type="button"
              onClick={() => toggleSection('media')}
              className="w-full flex items-center justify-between p-4 bg-brand-cream/40 hover:bg-brand-cream/60 transition text-left"
            >
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-charcoal">
                <FileText className="w-4 h-4 text-brand-gold" />
                <span>Media & Certificates</span>
              </div>
              {openSections.media ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronRight className="w-4 h-4 text-brand-muted" />}
            </button>

            {openSections.media && (
              <div className="p-4 sm:p-6 space-y-4 bg-white border-t border-brand-sand">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Company Logo (File or URL)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange('logo', e.target.files)}
                      className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-charcoal"
                    />
                    <input
                      type="text"
                      value={form.logoUrl || ''}
                      onChange={e => handleFieldChange('logoUrl', e.target.value)}
                      placeholder="Or existing logo URL..."
                      className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Company Profile PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={e => handleFileChange('companyProfilePdf', e.target.files)}
                      className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-charcoal"
                    />
                    <input
                      type="text"
                      value={form.companyProfilePdfUrl || ''}
                      onChange={e => handleFieldChange('companyProfilePdfUrl', e.target.value)}
                      placeholder="Or existing PDF URL..."
                      className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Showroom / Facility Photos</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => handleFileChange('photos', e.target.files)}
                      className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-charcoal"
                    />
                    <textarea
                      rows={2}
                      value={form.photoUrls || ''}
                      onChange={e => handleFieldChange('photoUrls', e.target.value)}
                      placeholder="Existing photo URLs (one per line)..."
                      className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-charcoal mb-1">Certificates / Compliance Documents</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={e => handleFileChange('certificates', e.target.files)}
                      className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-charcoal"
                    />
                    <textarea
                      rows={2}
                      value={form.certificateUrls || ''}
                      onChange={e => handleFieldChange('certificateUrls', e.target.value)}
                      placeholder="Existing certificate URLs (one per line)..."
                      className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-bold font-sans uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50 transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save All Business Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
