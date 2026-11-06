// src/components/NovoMentoradoModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, CheckCircle2, Building2, Phone, FileText, Sparkles } from 'lucide-react';

export default function NovoMentoradoModal({ isOpen, onClose, onSaveStudent }) {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: '',
    negocio: '',
    whatsapp: '',
    documento: '',
    statusNegocio: 'Informal',
    cnpj: '',
    etapaPrograma: 'Inscrito',
    avatar: '💼'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};
    if (!formData.nome.trim() || formData.nome.trim().length < 3) {
      errs.nome = 'Nome completo é obrigatório (mínimo de 3 caracteres).';
    }
    if (!formData.negocio.trim()) {
      errs.negocio = 'Nome do negócio ou projeto é obrigatório.';
    }
    
    const phoneDigits = formData.whatsapp.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      errs.whatsapp = 'Telefone inválido. Informe o DDD e o número completo.';
    }

    if (formData.statusNegocio === 'MEI') {
      const cnpjDigits = formData.cnpj.replace(/\D/g, '');
      if (cnpjDigits.length !== 14) {
        errs.cnpj = 'Para empresas MEI, informe os 14 dígitos do CNPJ.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newStudent = {
      id: `aluno-${Date.now()}`,
      nome: formData.nome.trim(),
      negocio: formData.negocio.trim(),
      whatsapp: formData.whatsapp.trim(),
      documento: formData.documento.trim() || 'Não informado',
      statusNegocio: formData.statusNegocio,
      cnpj: formData.statusNegocio === 'MEI' ? formData.cnpj.trim() : '',
      etapaPrograma: formData.etapaPrograma,
      sessaoAtual: 1,
      totalFaltas: 0,
      totalReagendamentos: 0,
      statusFormalizacaoMei: formData.statusNegocio === 'MEI' ? 'Formalizado' : 'Não Iniciado',
      avatar: formData.avatar
    };

    onSaveStudent(newStudent);
    onClose();

    setFormData({
      nome: '',
      negocio: '',
      whatsapp: '',
      documento: '',
      statusNegocio: 'Informal',
      cnpj: '',
      etapaPrograma: 'Inscrito',
      avatar: '💼'
    });
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-cad-title"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200/90 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Oficial SENAC */}
        <div className="bg-gradient-to-r from-[#00386C] via-[#004A8D] to-[#00264A] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#F29100] text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modal-cad-title" className="text-base font-black tracking-tight text-white">
                  Cadastrar Novo Mentorado
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                  SENAC Hub
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Inscrição de empreendedor na esteira do Co.Nexo SENAC
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com visual limpo, moderno e profissional */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome e Ícone */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3 space-y-1">
              <label htmlFor="mentorado-nome" className="text-xs font-bold text-slate-700 block">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                id="mentorado-nome"
                type="text"
                placeholder="Ex: Carlos Eduardo Lima"
                value={formData.nome}
                onChange={(e) => {
                  setFormData({ ...formData, nome: e.target.value });
                  if (errors.nome) setErrors({ ...errors, nome: null });
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-slate-50/70 text-slate-900 outline-none transition ${
                  errors.nome 
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/30' 
                    : 'border-slate-200 focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15'
                }`}
              />
              {errors.nome && <p className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.nome}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="mentorado-avatar" className="text-xs font-bold text-slate-700 block">
                Ícone
              </label>
              <select
                id="mentorado-avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-2.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 outline-none focus:bg-white focus:border-[#004A8D]"
              >
                {['💼', '👨‍🍳', '🧁', '🎨', '🔧', '⚡', '✂️', '🍕', '💻', '🛒'].map((emoji) => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Nome do Negócio */}
          <div className="space-y-1">
            <label htmlFor="mentorado-negocio" className="text-xs font-bold text-slate-700 block">
              Nome do Negócio / Empreendimento <span className="text-rose-500">*</span>
            </label>
            <input
              id="mentorado-negocio"
              type="text"
              placeholder="Ex: Marmitaria Sabor da Vila"
              value={formData.negocio}
              onChange={(e) => {
                setFormData({ ...formData, negocio: e.target.value });
                if (errors.negocio) setErrors({ ...errors, negocio: null });
              }}
              className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-slate-50/70 text-slate-900 outline-none transition ${
                errors.negocio 
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/30' 
                  : 'border-slate-200 focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15'
              }`}
            />
            {errors.negocio && <p className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.negocio}</p>}
          </div>

          {/* Contato WhatsApp e Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="mentorado-whatsapp" className="text-xs font-bold text-slate-700 block">
                WhatsApp com DDD <span className="text-rose-500">*</span>
              </label>
              <input
                id="mentorado-whatsapp"
                type="text"
                placeholder="(11) 98765-4321"
                value={formData.whatsapp}
                onChange={(e) => {
                  setFormData({ ...formData, whatsapp: e.target.value });
                  if (errors.whatsapp) setErrors({ ...errors, whatsapp: null });
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-slate-50/70 text-slate-900 outline-none transition ${
                  errors.whatsapp 
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/30' 
                    : 'border-slate-200 focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15'
                }`}
              />
              {errors.whatsapp && <p className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.whatsapp}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="mentorado-cpf" className="text-xs font-bold text-slate-700 block">
                CPF do Titular
              </label>
              <input
                id="mentorado-cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.documento}
                onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 outline-none focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15 transition"
              />
            </div>
          </div>

          {/* Situação Cadastral: Informal ou MEI */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              Situação Cadastral
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, statusNegocio: 'Informal', cnpj: '' })}
                className={`py-2.5 px-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  formData.statusNegocio === 'Informal'
                    ? 'border-[#004A8D] bg-blue-50/60 text-[#004A8D] shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {formData.statusNegocio === 'Informal' && <CheckCircle2 className="w-3.5 h-3.5 text-[#004A8D]" />}
                <span>Informal (Sem CNPJ)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, statusNegocio: 'MEI' })}
                className={`py-2.5 px-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  formData.statusNegocio === 'MEI'
                    ? 'border-[#004A8D] bg-blue-50/60 text-[#004A8D] shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {formData.statusNegocio === 'MEI' && <CheckCircle2 className="w-3.5 h-3.5 text-[#004A8D]" />}
                <span>MEI Formalizado</span>
              </button>
            </div>
          </div>

          {/* Campo Condicional de CNPJ para MEI */}
          {formData.statusNegocio === 'MEI' && (
            <div className="space-y-1 pt-1 animate-fade-in">
              <label htmlFor="mentorado-cnpj" className="text-xs font-bold text-slate-700 block">
                CNPJ da Empresa <span className="text-rose-500">*</span>
              </label>
              <input
                id="mentorado-cnpj"
                type="text"
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => {
                  setFormData({ ...formData, cnpj: e.target.value });
                  if (errors.cnpj) setErrors({ ...errors, cnpj: null });
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-2xl border bg-slate-50/70 text-slate-900 outline-none transition ${
                  errors.cnpj 
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/30' 
                    : 'border-slate-200 focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/15'
                }`}
              />
              {errors.cnpj && <p className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.cnpj}</p>}
            </div>
          )}

          {/* Rodapé com Ações */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] active:scale-[0.99] text-white font-black text-xs shadow-md shadow-[#004A8D]/25 transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F29100]" />
              <span>Salvar Mentorado</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
