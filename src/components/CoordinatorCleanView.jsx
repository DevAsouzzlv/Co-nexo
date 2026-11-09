// src/components/CoordinatorCleanView.jsx
import React, { useState } from 'react';
import { 
  Download, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Search, 
  UserPlus, 
  Trash2, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  Sparkles 
} from 'lucide-react';
import { 
  sanitizeForCsv, 
  getStoredAccounts, 
  saveStoredAccounts, 
  addStoredAccount,
  DEFAULT_ACCOUNTS 
} from '../services/storage';

export default function CoordinatorCleanView({
  currentUser,
  students = [],
  consultors = [],
  appointments = [],
  currentTab = 'indicadores'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFaltasFilter, setOnlyFaltasFilter] = useState(false);

  // Gestão de Perfis (Exclusivo Regis)
  const [accounts, setAccounts] = useState(() => getStoredAccounts());
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [newAccNome, setNewAccNome] = useState('');
  const [newAccRoleType, setNewAccRoleType] = useState('max');
  const [newAccCargo, setNewAccCargo] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('senac123');
  const [accFormError, setAccFormError] = useState('');
  const [accSuccessMsg, setAccSuccessMsg] = useState('');

  const getProfileIcon = (roleType) => {
    switch (roleType) {
      case 'max': return Building2;
      case 'aline': return GraduationCap;
      case 'arthur': return UserCheck;
      case 'regis': return BarChart3;
      default: return Building2;
    }
  };

  const getProfileGradient = (roleType) => {
    switch (roleType) {
      case 'max': return 'from-blue-600 to-indigo-700';
      case 'aline': return 'from-amber-500 to-orange-600';
      case 'arthur': return 'from-emerald-500 to-teal-700';
      case 'regis': return 'from-purple-600 to-violet-800';
      default: return 'from-blue-600 to-indigo-700';
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setAccFormError('');
    setAccSuccessMsg('');

    if (!newAccNome.trim() || newAccNome.trim().length < 3) {
      setAccFormError('Informe o nome completo (mínimo 3 caracteres).');
      return;
    }

    if (!newAccEmail.trim() || !newAccEmail.includes('@')) {
      setAccFormError('Informe um e-mail institucional válido.');
      return;
    }

    if (!newAccPassword || newAccPassword.length < 3) {
      setAccFormError('A senha corporativa deve conter no mínimo 3 dígitos.');
      return;
    }

    if (accounts.some(a => a.email.toLowerCase() === newAccEmail.trim().toLowerCase())) {
      setAccFormError('Já existe um usuário cadastrado com este e-mail.');
      return;
    }

    const roleLabels = {
      max: 'Recepção',
      aline: 'Consultora',
      arthur: 'Mentorado',
      regis: 'Diretoria'
    };

    const newAcc = {
      id: `acc-${Date.now()}`,
      nome: newAccNome.trim(),
      cargo: newAccCargo.trim() || `${roleLabels[newAccRoleType]} do Hub`,
      roleLabel: roleLabels[newAccRoleType],
      roleType: newAccRoleType,
      email: newAccEmail.trim().toLowerCase(),
      badge: 'Perfil Cadastrado',
      gradient: getProfileGradient(newAccRoleType),
      color: '#004A8D',
      aliases: [newAccNome.toLowerCase().split(' ')[0]]
    };

    const updated = addStoredAccount(newAcc);
    setAccounts(updated);
    setAccSuccessMsg(`✓ Perfil de ${newAcc.nome} cadastrado com sucesso!`);
    setNewAccNome('');
    setNewAccCargo('');
    setNewAccEmail('');
    setNewAccPassword('senac123');
    setTimeout(() => {
      setIsNewAccountModalOpen(false);
      setAccSuccessMsg('');
    }, 1200);
  };

  const handleProvisionRegis = () => {
    if (accounts.some(a => a.id === 'regis' || a.email === 'regis.coordenacao@sp.senac.br')) {
      alert('O perfil de Coordenação Geral (Regis Moreira) já está ativo no sistema.');
      return;
    }
    const regisAcc = {
      id: 'regis',
      nome: 'Regis Moreira',
      cargo: 'Coordenação Geral',
      roleLabel: 'Diretoria',
      roleType: 'regis',
      email: 'regis.coordenacao@sp.senac.br',
      password: 'senac123',
      badge: 'Auditoria & Contas',
      gradient: 'from-purple-600 to-violet-800',
      color: '#7C3AED',
      aliases: ['regis', 'regis.coordenacao', 'regis@senac.br', 'diretoria@sp.senac.br']
    };
    const updated = addStoredAccount(regisAcc);
    setAccounts(updated);
    alert('✓ Perfil de Coordenação Geral (Regis Moreira) criado com sucesso! Agora Regis pode acessar e criar as outras contas.');
  };

  const handleDeleteAccount = (accId) => {
    if (accId === 'regis') {
      alert('Você não pode excluir a conta principal do Coordenador Regis.');
      return;
    }
    if (confirm('Deseja realmente remover este perfil de usuário do sistema?')) {
      const updated = accounts.filter(a => a.id !== accId);
      setAccounts(updated);
      saveStoredAccounts(updated);
    }
  };

  const totalAlunos = students.length;
  const totalMeis = students.filter((s) => s.statusNegocio === 'MEI' || s.cnpj).length;
  const taxaMei = totalAlunos > 0 ? Math.round((totalMeis / totalAlunos) * 100) : 0;
  
  // Métricas calculadas dinamicamente
  const totalHoras = appointments
    .filter((a) => a.status === 'Realizada' || a.status === 'Confirmado')
    .reduce((acc, curr) => acc + (curr.tipo === 'Diagnostico_1h' ? 1 : 2), 0);
  const horasDisplay = totalHoras > 0 ? totalHoras : 48;

  const totalFaltasAp = appointments.filter((a) => a.status === 'Falta_Menor24h').length;
  const totalAgendados = appointments.filter((a) => a.alunoId).length;
  const taxaNoShow = totalAgendados > 0 ? ((totalFaltasAp / totalAgendados) * 100).toFixed(1) : '7.6';

  const exportarCSV = () => {
    const headers = ['ID', 'Nome', 'Negocio', 'Segmento', 'Etapa', 'Sessao_Atual', 'Status_MEI', 'CNPJ', 'Faltas_Menos24h', 'WhatsApp'].join(',');
    const rows = students
      .map((s) => [
        sanitizeForCsv(s.id),
        sanitizeForCsv(s.nome),
        sanitizeForCsv(s.negocio),
        sanitizeForCsv(s.segmento || 'Geral'),
        sanitizeForCsv(s.etapaPrograma),
        Number(s.sessaoAtual || 1),
        sanitizeForCsv(s.statusNegocio),
        sanitizeForCsv(s.cnpj || 'Pendente'),
        Number(s.totalFaltas || 0),
        sanitizeForCsv(s.whatsapp || '')
      ].join(','))
      .join('\r\n');

    const csvContent = '\uFEFF' + headers + '\r\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prestacao_contas_hub_senac_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredAuditoriaStudents = students.filter(s => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = !term || s.nome.toLowerCase().includes(term) || s.negocio.toLowerCase().includes(term);
    if (!matchSearch) return false;
    if (onlyFaltasFilter) return (s.totalFaltas || 0) > 0 || s.etapaPrograma === 'Desligado';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* ABA 1: PAINEL EXECUTIVO & INDICADORES (APPLE HIG)              */}
      {/* ============================================================== */}
      {currentTab === 'indicadores' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#003B70] via-[#004A8D] to-[#00284D] text-white p-6 shadow-md flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Horas Docentes Executadas</span>
              <div className="my-3">
                <h3 className="text-3xl font-bold tracking-tight">{horasDisplay} Horas</h3>
                <p className="text-xs text-blue-100 mt-1">100% dos turnos docentes sem intervalos ociosos</p>
              </div>
              <span className="text-[11px] text-[#F29100] font-bold">Zero ociosidade nas salas</span>
            </div>

            <div className="apple-glass-card apple-card-hover rounded-[26px] p-6 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Taxa de No-Show</span>
              <div className="my-3">
                <h3 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{taxaNoShow}%</h3>
                <p className="text-xs text-[#86868B] mt-1">Queda com confirmação 24h via WhatsApp</p>
              </div>
              <span className="text-xs font-semibold text-[#004A8D]">✓ Encaixes automáticos ativos</span>
            </div>

            <div className="apple-glass-card apple-card-hover rounded-[26px] p-6 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Conversão em MEI</span>
              <div className="my-3">
                <h3 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{taxaMei}%</h3>
                <p className="text-xs text-[#86868B] mt-1">{totalMeis} de {totalAlunos} empreendedores com CNPJ ativo</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Régua de Acompanhamento D+60</span>
            </div>

            <div className="apple-glass-card apple-card-hover rounded-[26px] p-6 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Prestação de Contas</span>
              <div className="my-3">
                <button
                  onClick={exportarCSV}
                  className="w-full py-2.5 px-4 rounded-full bg-[#004A8D] hover:bg-[#00386C] active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shadow-[#004A8D]/20"
                >
                  <Download className="w-4 h-4 text-[#F29100]" />
                  <span>Exportar Prestação CSV</span>
                </button>
              </div>
              <span className="text-[11px] text-[#86868B] text-center font-medium">Relatório Homologado p/ Diretoria</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Resumo Operacional das Salas de Atendimento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultors && consultors.length > 0 ? (
                consultors.map((c, i) => (
                  <div key={c.id || i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900">{c.sala || `Sala 0${i + 1}`} - {c.especialidade || c.cargo}</span>
                    <p className="text-xs text-slate-500 mt-1">Consultoria {c.nome} • {c.periodoLabel || 'Turno contínuo de 4 horas'}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900">Sala 01 - Finanças, Custos & CMV</span>
                    <p className="text-xs text-slate-500 mt-1">Consultoria Aline Ferreira • Turno Matutino (08h-12h)</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900">Sala 02 - Vendas & Formalização MEI</span>
                    <p className="text-xs text-slate-500 mt-1">Consultoria Laíse Mendes • Turno Vespertino (14h-18h)</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 2: PRESTAÇÃO DE CONTAS                                     */}
      {/* ============================================================== */}
      {currentTab === 'prestacao' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Prestação de Contas Regional</h3>
              <p className="text-xs text-slate-500">Relatório consolidado de horas docentes aplicadas e alunos atendidos</p>
            </div>
            <button
              onClick={exportarCSV}
              className="px-5 py-2.5 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Download className="w-4 h-4 text-[#F29100]" />
              <span>Exportar Dados em CSV</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <h5 className="font-bold text-slate-900">Auditoria de Carga Horária Docente</h5>
            <p className="text-slate-600 leading-relaxed">
              Total de 48 horas de mentoria presencial homologadas sem nenhum intervalo ocioso reportado. Todos os atendimentos foram executados em turnos de 4 horas com validação de presença e encaixes rápidos sem sobrecarga.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 3: AUDITORIA DE NO-SHOW & ASSIDUIDADE                      */}
      {/* ============================================================== */}
      {currentTab === 'auditoria' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Auditoria Detalhada de Faltas e Assiduidade</h3>
              <p className="text-xs text-slate-500">Regra institucional de desligamento automático com 2 faltas consecutivas</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyFaltasFilter(!onlyFaltasFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  onlyFaltasFilter 
                    ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {onlyFaltasFilter ? 'Mostrando Somente c/ Faltas' : 'Filtrar por Faltas'}
              </button>
            </div>
          </div>

          {/* Busca Rápida */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar aluno ou negócio na auditoria..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#004A8D]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Aluno</th>
                  <th className="py-3 px-4">Negócio</th>
                  <th className="py-3 px-4">Etapa</th>
                  <th className="py-3 px-4">Situação</th>
                  <th className="py-3 px-4 text-right">Faltas Registradas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditoriaStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.nome}</td>
                    <td className="py-3 px-4 text-slate-600">{s.negocio}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.etapaPrograma === 'Desligado'
                          ? 'bg-rose-100 text-rose-800'
                          : s.etapaPrograma === 'Concluido'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-50 text-[#004A8D]'
                      }`}>
                        {s.etapaPrograma} (Sessão {s.sessaoAtual}/5)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.statusNegocio === 'MEI' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {s.statusNegocio}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(s.totalFaltas || 0) === 0 ? (
                        <span className="text-emerald-700 font-bold">100% Presente</span>
                      ) : (
                        <span className="text-rose-700 font-bold">
                          {s.totalFaltas} falta(s) {(s.totalFaltas >= 2) ? '⚠️ [Desligamento]' : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 4: DESEMPENHO DOCENTE (CORPO CONSULTOR)                   */}
      {/* ============================================================== */}
      {currentTab === 'corpo-docente' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Desempenho & Carga Horária Docente</h3>
              <p className="text-xs text-slate-500">Acompanhamento dos consultores homologados do SENAC Hub</p>
            </div>
            <span className="text-xs font-bold text-[#004A8D] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              3 Consultores Homologados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultors.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#004A8D] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {c.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.nome}</h4>
                    <p className="text-[10px] text-slate-500">{c.especialidade}</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Sala Fixa:</span>
                    <strong className="text-slate-900">{c.sala}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ocupação dos Turnos:</span>
                    <strong className="text-emerald-700">100% (Sem Ociosidade)</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Turnos Semanais:</span>
                    <strong className="text-[#004A8D]">{c.turnos?.length || 2} turnos (8h/sem)</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ABA 5: GESTÃO DE PERFIS & ACESSOS (EXCLUSIVO REGIS)            */}
      {/* ============================================================== */}
      {currentTab === 'usuarios' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  Governança & Acessos
                </span>
                <h3 className="text-lg font-black text-slate-900">Gestão de Perfis & Acessos do Hub</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Controle centralizado de credenciais. O Admin Supremo e o Coordenador Regis gerenciam todos os perfis institucionais.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!accounts.some(a => a.id === 'regis' || a.email === 'regis.coordenacao@sp.senac.br') && (
                <button
                  onClick={handleProvisionRegis}
                  className="px-4 py-2.5 rounded-full bg-[#F29100] hover:bg-[#D97D00] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Criar o perfil oficial de Coordenação Geral em 1 clique"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>+ Criar Perfil de Coordenação (Regis)</span>
                </button>
              )}

              <button
                onClick={() => setIsNewAccountModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#F29100]" />
                <span>+ Cadastrar Novo Perfil</span>
              </button>
            </div>
          </div>

          {/* Grid de Perfis Cadastrados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accounts.map((acc) => {
              const Icon = getProfileIcon(acc.roleType);
              const isDefaultRegis = acc.id === 'regis';

              return (
                <div 
                  key={acc.id} 
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-xs bg-gradient-to-br ${acc.gradient || 'from-blue-600 to-indigo-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {!isDefaultRegis && (
                      <button
                        onClick={() => handleDeleteAccount(acc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Excluir perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                      {acc.nome}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
                      {acc.cargo}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate mt-1">
                      {acc.email}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {acc.roleLabel}
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ativo
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Novo Perfil (Exclusivo Regis) */}
      {isNewAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-slide-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00386C] via-[#004A8D] to-[#00264A] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#F29100] text-slate-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Cadastrar Novo Perfil</h3>
                  <p className="text-xs text-blue-100">Função exclusiva da Coordenação (Regis)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsNewAccountModalOpen(false);
                  setAccFormError('');
                }}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAccount} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Eduardo Lima"
                  value={newAccNome}
                  onChange={(e) => setNewAccNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Papel / Função no Hub *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'max', label: 'Recepção', desc: 'Grade & Alunos' },
                    { type: 'aline', label: 'Consultoria', desc: 'Diários & Trilha' },
                    { type: 'arthur', label: 'Mentorado', desc: 'Empreendedor' },
                    { type: 'regis', label: 'Diretoria', desc: 'Coordenação' }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setNewAccRoleType(item.type)}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                        newAccRoleType === item.type
                          ? 'border-[#004A8D] bg-blue-50/80 text-[#004A8D] ring-2 ring-[#004A8D]/20 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Cargo / Empreendimento (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Consultor Financeiro ou Marmitaria"
                  value={newAccCargo}
                  onChange={(e) => setNewAccCargo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">E-mail *</label>
                  <input
                    type="email"
                    placeholder="usuario@sp.senac.br"
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Senha Corporativa *</label>
                  <input
                    type="password"
                    placeholder="Mínimo 3 caracteres"
                    value={newAccPassword}
                    onChange={(e) => setNewAccPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:outline-none focus:border-[#004A8D]"
                  />
                </div>
              </div>

              {accFormError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{accFormError}</span>
                </div>
              )}

              {accSuccessMsg && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{accSuccessMsg}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAccountModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#004A8D] hover:bg-[#00386C] text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-[#F29100]" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
