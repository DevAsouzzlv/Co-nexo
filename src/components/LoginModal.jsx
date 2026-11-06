// src/components/LoginModal.jsx
import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2,
  X
} from 'lucide-react';
import { USER_PROFILES } from '../services/userProfiles';

export { USER_PROFILES };

export default function LoginModal({ isOpen, onClose, onSelectProfile, currentPersona }) {
  const [selectedId, setSelectedId] = useState(currentPersona || 'max');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectProfile(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-lg shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#171b26] text-white flex items-center justify-between border-b border-[#2a3044]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-[#F29100] text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              CN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Portal de Acesso Co.Nexo</h2>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white/20 text-white">
                  SENAC Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Selecione o perfil de usuário para acessar o seu painel exclusivo
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Corpo: Grade das 4 Telas */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Módulos Operacionais Disponíveis
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup">
            {USER_PROFILES.map((profile) => {
              const isSelected = selectedId === profile.id;
              const Icon = profile.icon;

              return (
                <button
                  type="button"
                  key={profile.id}
                  onClick={() => setSelectedId(profile.id)}
                  className={`p-3.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#004A8D] bg-blue-50/50 shadow-2xs ring-1 ring-[#004A8D]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-[#004A8D] text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-slate-900">{profile.nome}</h3>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${profile.accentBg}`}>
                            {profile.roleLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{profile.cargo}</p>
                      </div>
                    </div>

                    <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#004A8D] text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                    {profile.descricao}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">
                      Módulo: <strong className="text-slate-700">{profile.badge}</strong>
                    </span>
                    <span className={`font-bold flex items-center gap-0.5 ${
                      isSelected ? 'text-[#004A8D]' : 'text-slate-400'
                    }`}>
                      Selecionar
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Você pode alternar entre perfis no topo da tela a qualquer momento.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-md bg-[#004A8D] hover:bg-[#003B70] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
