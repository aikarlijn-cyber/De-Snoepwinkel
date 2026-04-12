import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Candy, 
  BookOpen, 
  Users, 
  MapPin, 
  Clock, 
  Euro, 
  ChevronLeft, 
  Search, 
  Filter,
  GraduationCap,
  Info,
  ExternalLink,
  Sparkles,
  ShoppingBasket,
  Trash2,
  X,
  CheckCircle2,
  BarChart3,
  Lock,
  Download,
  DownloadCloud,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { courses, Course } from './data/courses';
import { auth, db } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  getDocFromServer,
  doc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';

const CATEGORY_COLORS = {
  Extern: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200',
  Collega: 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200',
  Overig: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
  Congres: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
};

const CATEGORY_ICONS = {
  Extern: <ExternalLink className="w-4 h-4" />,
  Collega: <Users className="w-4 h-4" />,
  Overig: <Info className="w-4 h-4" />,
  Congres: <GraduationCap className="w-4 h-4" />,
};

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [cart, setCart] = useState<Course[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [enrollmentData, setEnrollmentData] = useState<Record<number, { count: number, names: string[] }>>({});
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const admins = ['aikarlijn@gmail.com', 'n.uitermark@kentalis.nl'];
  const isAdmin = user?.email ? admins.includes(user.email) : false;

  // Real-time enrollment data for admins
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'enrollments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataMap: Record<number, { count: number, names: string[] }> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const courseId = data.courseId;
        const name = data.userName || 'Onbekend';
        
        if (!dataMap[courseId]) {
          dataMap[courseId] = { count: 0, names: [] };
        }
        dataMap[courseId].count += 1;
        if (!dataMap[courseId].names.includes(name)) {
          dataMap[courseId].names.push(name);
        }
      });
      setEnrollmentData(dataMap);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdminClick = async () => {
    if (isAdmin) {
      setIsAdminOpen(true);
    } else {
      setShowEmailLogin(true);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email && admins.includes(result.user.email)) {
        setIsAdminOpen(true);
        setShowEmailLogin(false);
      } else {
        alert(`Toegang geweigerd: ${result.user.email} is geen beheerder.`);
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-blocked') {
        alert('De inlog pop-up is geblokkeerd door je browser. Sta pop-ups toe voor deze website.');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('Dit domein (Netlify) is nog niet geautoriseerd in Firebase. Voeg snoepwinkeltieloss.netlify.app toe aan de "Authorized Domains" in de Firebase Console.');
      } else {
        alert('Inloggen mislukt: ' + error.message);
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        if (!admins.includes(adminEmail)) {
          setLoginError('Alleen geautoriseerde beheerders kunnen een account aanmaken.');
          setIsSubmitting(false);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        setIsAdminOpen(true);
        setShowEmailLogin(false);
        setAdminPassword('');
        setIsRegistering(false);
      } else {
        const result = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        if (result.user.email && admins.includes(result.user.email)) {
          setIsAdminOpen(true);
          setShowEmailLogin(false);
          setAdminPassword('');
        } else {
          setLoginError(`Toegang geweigerd: ${result.user.email} is geen beheerder.`);
          await signOut(auth);
        }
      }
    } catch (error: any) {
      console.error("Auth failed:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setLoginError('Onjuist e-mailadres of wachtwoord.');
      } else if (error.code === 'auth/email-already-in-use') {
        setLoginError('Dit e-mailadres is al geregistreerd. Log in of gebruik wachtwoord vergeten.');
      } else if (error.code === 'auth/weak-password') {
        setLoginError('Het wachtwoord moet minimaal 6 tekens bevatten.');
      } else {
        setLoginError('Inloggen mislukt: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!adminEmail) {
      setLoginError('Vul eerst je e-mailadres in.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, adminEmail);
      alert('Er is een e-mail gestuurd om je wachtwoord te resetten.');
    } catch (error: any) {
      setLoginError('Fout bij versturen reset e-mail: ' + error.message);
    }
  };

  const handleLogout = () => signOut(auth);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(225, 29, 72); // rose-600
      doc.text("Mijn Keuzelijst Scholingen", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Naam: ${userName || 'Onbekend'}`, 14, 32);
      doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 14, 37);
      
      const totalHours = cart.reduce((acc, item) => acc + (item.totalHours || 0), 0);
      doc.text(`Totaal indicatie uren: ${totalHours} uur`, 14, 42);

      // Table
      const tableData = cart.map(item => [
        `#${item.id}`,
        item.title,
        item.category,
        item.duration || 'n.v.t.'
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['ID', 'Scholing', 'Categorie', 'Duur']],
        body: tableData,
        headStyles: { fillColor: [225, 29, 72] }, // rose-600
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 }
        }
      });

      const fileName = `Keuzelijst_Scholingen_${(userName || 'Lijst').replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Er ging iets mis bij het maken van de PDF. Probeer het opnieuw.");
    }
  };

  const handleClearDatabase = async () => {
    if (!isAdmin) return;
    setIsClearing(true);
    try {
      const snapshot = await getDocs(collection(db, 'enrollments'));
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      setShowClearConfirm(false);
    } catch (error: any) {
      console.error("Error clearing database:", error);
      if (error.code === 'permission-denied') {
        alert("Geen toestemming om de database leeg te maken. Controleer of je bent ingelogd met een beheerder-account en of je e-mailadres is geverifieerd.");
      } else {
        alert("Er ging iets mis bij het leegmaken van de database: " + (error.message || "Onbekende fout"));
      }
    } finally {
      setIsClearing(false);
    }
  };

  const handleExport = () => {
    const exportData = courses
      .map(course => ({
        'ID': course.id,
        'Titel': course.title,
        'Categorie': course.category,
        'Aantal Aanmeldingen': enrollmentData[course.id]?.count || 0,
        'Namen': enrollmentData[course.id]?.names?.join(', ') || ''
      }))
      .filter(item => item['Aantal Aanmeldingen'] > 0)
      .sort((a, b) => b['Aantal Aanmeldingen'] - a['Aantal Aanmeldingen']);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aanmeldingen");
    
    XLSX.writeFile(workbook, `Snoepwinkel_Aanmeldingen_${new Date().toLocaleDateString('nl-NL')}.xlsx`);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = ['All', 'Extern', 'Collega', 'Overig', 'Congres'];

  const toggleCartItem = (course: Course) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === course.id);
      if (exists) {
        return prev.filter(item => item.id !== course.id);
      }
      return [...prev, course];
    });
    setIsSubmitted(false);
  };

  const isInCart = (courseId: number) => cart.some(item => item.id === courseId);

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-800 font-sans selection:bg-rose-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 transform -rotate-6">
              <Candy className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">De Snoepwinkel</h1>
              <p className="text-sm text-rose-500 font-medium">Scholingsbrochure 2026-2027</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Zoek een scholing..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-2">
                  <img 
                    src={user.photoURL || ''} 
                    alt={user.displayName || ''} 
                    className="w-8 h-8 rounded-full border border-rose-100"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Uitloggen Beheerder"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button 
                onClick={handleAdminClick}
                className={`p-3 border rounded-xl transition-all group flex items-center gap-2 ${
                  isAdmin 
                    ? 'bg-slate-900 border-slate-800 text-white shadow-lg shadow-slate-200' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
                title="Beheerder Overzicht"
              >
                <Lock className={`w-5 h-5 ${isAdmin ? 'text-white' : 'text-slate-600'}`} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Beheer</span>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all group"
              >
                <ShoppingBasket className="w-5 h-5 text-slate-600 group-hover:text-rose-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <section className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-6 sm:p-10 border border-white shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Welkom bij de Snoepwinkel Tiel-Oss</h2>
                  <div className="text-slate-600 leading-relaxed mb-6 space-y-4">
                    <p>
                      Komend schooljaar gaan we bij genoeg interesse onderstaande scholing aanbieden. Per jaar kun je maximaal 123 uur en 550 euro naar rato in te zetten. Maak een overzicht voor jezelf, hoe zou je deze uren willen indelen? En welke scholing uit onderstaand aanbod zou daarbij passen? Denk ook aan literatuur die je wilt lezen, collegiale consultatie, werkbezoeken bij collega’s enz. 
                    </p>
                    <p>
                      Op basis van je keuze gaan we de scholing inplannen, we gaan er dan dus vanuit dat je inschrijving definitief is. Het kan voorkomen dat we niet voldoende interesse hebben voor een training/workshop. In dat geval krijg je bericht. Ook kan het voorkomen dat de groep vol is. In dat geval gaan we loten. 
                    </p>
                    <div className="bg-white/50 p-4 rounded-xl border border-rose-100">
                      <p className="font-semibold text-slate-800 mb-1">Berekenen professionaliseringsbudget: fte x 550 euro</p>
                      <p className="font-semibold text-slate-800">Berekenen professionaliseringsuren: fte x 123 uur</p>
                      <p className="text-xs mt-1 italic">(let op, de CAO heeft de duurzame inzetbaarheidsuren en professionaliseringsuren bij elkaar geschoven. Bedenk dus hoe je de uren wilt inzetten)</p>
                    </div>
                    <p>
                      Het aanbod aan congressen is haast oneindig. Hieronder bieden we een aantal congressen aan die vaker door medewerkers van de AD bezocht worden. We willen hiermee niet volledig zijn. Heb je een ander congres dat je wil bezoeken, dat kan. Houd rekening met de kosten bij de planning van je professionaliseringsbudget en noteer het congres dat je wilt bezoeken in je professionaliseringsoverzicht.
                    </p>
                    <p className="text-emerald-600 font-medium italic">
                      &gt; TIP! Je kunt hieronder alle scholingen bekijken, maar ook klikken op de verschillende categorieën of de zoekfunctie gebruiken. Wil je iets met gespreksvaardigheden? Dan kun je bijv. 'gesprek' typen.
                    </p>
                    <p className="font-bold text-rose-600">
                      Veel plezier met het uitzoeken van je scholing!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          activeCategory === cat 
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'
                        }`}
                      >
                        {cat === 'All' ? 'Alles' : cat}
                      </button>
                    ))}
                  </div>
                </div>
                <Sparkles className="absolute right-10 top-10 w-32 h-32 text-rose-200/50 -rotate-12" />
              </section>))}
                        </div>
                      </section>
                    )}
                  </div>

                  <aside className="space-y-6">
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-6">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Info className="w-4 h-4 text-slate-400" />
                        Praktische Info
                      </h4>
                      
                      <div className="space-y-4">
                        {selectedCourse.duration && (
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-rose-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tijdsinvestering</p>
                              <p className="text-sm font-medium text-slate-700">{selectedCourse.duration}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedCourse.location && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Locatie</p>
                              <p className="text-sm font-medium text-slate-700">{selectedCourse.location}</p>
                            </div>
                          </div>
                        )}

                        {selectedCourse.costs && (
                          <div className="flex items-start gap-3">
                            <Euro className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kosten</p>
                              <p className="text-sm font-medium text-slate-700">{selectedCourse.costs}</p>
                            </div>
                          </div>
                        )}

                        {selectedCourse.targetAudience && (
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-purple-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Doelgroep</p>
                              <p className="text-sm font-medium text-slate-700">{selectedCourse.targetAudience}</p>
                            </div>
                          </div>
                        )}

                        {selectedCourse.maxParticipants && (
                          <div className="flex items-start gap-3">
                            <Filter className="w-5 h-5 text-amber-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deelnemers</p>
                              <p className="text-sm font-medium text-slate-700">{selectedCourse.maxParticipants}</p>
                            </div>
                          </div>
                        )}

                        {selectedCourse.trainer && (
                          <div className="flex items-start gap-3">
                            <UserIcon className="w-5 h-5 text-blue-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trainer / Organisatie</p>
                              <p className="text-sm font-medium text-slate-700">{selectedCourse.trainer}</p>
                            </div>
                          </div>
                        )}

                        {selectedCourse.website && (
                          <div className="flex items-start gap-3">
                            <ExternalLink className="w-5 h-5 text-rose-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Website</p>
                              <a 
                                href={selectedCourse.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-rose-500 hover:underline flex items-center gap-1"
                              >
                                Bezoek website
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border-2 border-rose-100 shadow-lg shadow-rose-500/5">
                      <h4 className="font-bold text-slate-900 mb-2">Toevoegen aan mandje?</h4>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Verzamel je favoriete scholingen in je winkelmandje om een overzicht te maken van je keuzes.
                      </p>
                      <button 
                        onClick={() => toggleCartItem(selectedCourse)}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          isInCart(selectedCourse.id)
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100'
                            : 'bg-rose-500 text-white shadow-md shadow-rose-100 hover:bg-rose-600'
                        }`}
                      >
                        {isInCart(selectedCourse.id) ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            In mandje
                          </>
                        ) : (
                          <>
                            <ShoppingBasket className="w-5 h-5" />
                            In mandje leggen
                          </>
                        )}
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Sidebar/Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                    <ShoppingBasket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Mijn Keuzelijst</h3>
                    <p className="text-xs text-slate-400">{cart.length} scholingen geselecteerd</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">Verzonden!</h3>
                      <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
                        Je keuzelijst is gemaild naar je leidinggevende en opgeslagen in het systeem.
                      </p>
                    </div>
                    <div className="w-full pt-4 space-y-3">
                      <button 
                        onClick={generatePDF}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                      >
                        <DownloadCloud className="w-5 h-5" />
                        Download als PDF
                      </button>
                      <button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setCart([]);
                          setIsCartOpen(false);
                        }}
                        className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                      >
                        Sluiten
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {cart.length > 0 && (
                      <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 space-y-3">
                        <label className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          Jouw Naam
                        </label>
                        <input 
                          type="text"
                          placeholder="Vul je volledige naam in..."
                          className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        <p className="text-[10px] text-rose-400 leading-tight">
                          * Je naam wordt opgeslagen in de database zodat de beheerder weet wie deze scholingen heeft gekozen.
                        </p>
                      </div>
                    )}

                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                          <ShoppingBasket className="w-10 h-10 text-slate-300" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Je mandje is nog leeg</p>
                          <p className="text-sm text-slate-500">Kies een scholing om deze hier te verzamelen.</p>
                        </div>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div 
                          key={item.id}
                          className="group bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-4 items-start"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm border border-slate-200 shrink-0">
                            {item.id}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">{item.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.totalHours || 0} uur
                              </span>
                              <span className="flex items-center gap-1">
                                <Euro className="w-3 h-3" />
                                € {item.totalCosts || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => toggleCartItem(item)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>

              {cart.length > 0 && !isSubmitted && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Totaal aantal uren</span>
                      <span className="text-slate-900 font-bold">
                        {cart.reduce((acc, item) => acc + (item.totalHours || 0), 0)} uur
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Totaal kosten</span>
                      <span className="text-slate-900 font-bold">
                        € {cart.reduce((acc, item) => acc + (item.totalCosts || 0), 0)}
                      </span>
                    </div>
                  </div>
                  <button 
                    disabled={!userName.trim() || isSubmitting}
                    className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                      !userName.trim() || isSubmitting
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600'
                    }`}
                    onClick={async () => {
                      if (!userName.trim()) return;
                      setIsSubmitting(true);
                      
                      // Save to Firestore
                      try {
                        for (const item of cart) {
                          await addDoc(collection(db, 'enrollments'), {
                            courseId: item.id,
                            courseTitle: item.title,
                            timestamp: serverTimestamp(),
                            userName: userName.trim(),
                            userEmail: user?.email || 'niet ingelogd'
                          });
                        }
                        
                        const email = 'N.uitermark@kentalis.nl';
                        const subject = encodeURIComponent(`Keuzelijst Scholingen 2026-2027 - ${userName.trim()}`);
                        const totalHours = cart.reduce((acc, item) => acc + (item.totalHours || 0), 0);
                        const totalCosts = cart.reduce((acc, item) => acc + (item.totalCosts || 0), 0);
                        
                        const courseList = cart.map(item => `- [#${item.id}] ${item.title} (${item.totalHours || 0} uur, €${item.totalCosts || 0})`).join('%0D%0A');
                        const body = encodeURIComponent(`Beste leidinggevende,%0D%0A%0D%0AHierbij de selectie van scholingen uit de Snoepwinkel van ${userName.trim()} voor het schooljaar 2026-2027:%0D%0A%0D%0A${courseList}%0D%0A%0D%0ATotaal indicatie uren: ${totalHours} uur.%0D%0ATotaal kosten: € ${totalCosts}.%0D%0A%0D%0AMet vriendelijke groet,%0D%0A${userName.trim()}`)
                          .replace(/%250D%250A/g, '%0D%0A');
                        
                        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                        setIsSubmitted(true);
                      } catch (error) {
                        console.error("Error saving enrollment:", error);
                        alert("Er ging iets mis bij het opslaan. Probeer het later opnieuw.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? 'Bezig met opslaan...' : 'Keuzelijst mailen naar leidinggevende'}
                  </button>
                  {!userName.trim() && cart.length > 0 && (
                    <p className="text-[10px] text-center text-rose-500 font-bold animate-pulse">
                      Vul eerst je naam in om te kunnen verzenden
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>{/* Admin Login Modal */}
      <AnimatePresence>
        {showEmailLogin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailLogin(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-200 mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isRegistering ? 'Account Aanmaken' : 'Beheerder Inloggen'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isRegistering 
                      ? 'Stel een wachtwoord in voor je beheerder-account' 
                      : 'Log in met je e-mailadres en wachtwoord'}
                  </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">E-mailadres</label>
                    <input 
                      type="email"
                      required
                      placeholder="naam@kentalis.nl"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Wachtwoord</label>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs text-rose-500 font-bold text-center bg-rose-50 py-2 rounded-lg border border-rose-100">
                      {loginError}
                    </p>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all disabled:opacity-50"
                  >
                    {isSubmitting 
                      ? (isRegistering ? 'Bezig met registreren...' : 'Bezig met inloggen...') 
                      : (isRegistering ? 'Account Aanmaken' : 'Inloggen')}
                  </button>
                </form>

                <div className="pt-2 flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setLoginError('');
                    }}
                    className="w-full py-3 px-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    {isRegistering 
                      ? 'Heb je al een account? Log hier in' 
                      : 'Nog geen account? Maak er hier een aan'}
                  </button>
                  
                  {!isRegistering && (
                    <button 
                      onClick={handleForgotPassword}
                      className="text-xs text-slate-400 font-medium hover:text-rose-500 transition-colors text-center"
                    >
                      Wachtwoord vergeten?
                    </button>
                  )}
                  
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300 bg-white px-2">Of</div>
                  </div>

                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                    Inloggen met Google
                  </button>

                  <button 
                    onClick={() => setShowEmailLogin(false)}
                    className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
                  >
                    Annuleren
                  </button>

                  {user && !isAdmin && (
                    <div className="pt-4 border-t border-slate-100 text-center">
                      <p className="text-[10px] text-slate-400 mb-2">Ingelogd als: {user.email}</p>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setShowEmailLogin(false);
                        }}
                        className="text-[10px] text-rose-500 font-bold uppercase tracking-widest hover:underline"
                      >
                        Uitloggen en opnieuw proberen
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  * Heb je nog geen wachtwoord? Gebruik "Wachtwoord vergeten" om er een in te stellen voor je Kentalis e-mailadres.
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Overview Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Beheerder Overzicht</h2>
                      <p className="text-sm text-slate-500">Live aanmeldingen per scholing</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAdminOpen(false)}
                    className="p-3 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between px-6 py-3 bg-slate-100 rounded-xl text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      <span>Scholing</span>
                      <span>Aanmeldingen</span>
                    </div>
                    {courses.sort((a, b) => (enrollmentData[b.id]?.count || 0) - (enrollmentData[a.id]?.count || 0)).map(course => (
                      <div 
                        key={course.id}
                        className="flex flex-col p-4 bg-white border border-slate-100 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-all group gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm border border-slate-100 group-hover:bg-white transition-colors">
                              {course.id}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{course.title}</h4>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{course.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(((enrollmentData[course.id]?.count || 0) / 10) * 100, 100)}%` }}
                                  className="h-full bg-rose-500"
                                />
                              </div>
                              <span className="text-lg font-black text-slate-900 w-8 text-right">
                                {enrollmentData[course.id]?.count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {enrollmentData[course.id]?.names && enrollmentData[course.id].names.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight w-full mb-1">Gekozen door:</span>
                            {enrollmentData[course.id].names.map((name, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-medium text-slate-600">
                                {name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-xs text-slate-400 italic">
                      * Dit overzicht toont live data uit de database.
                    </p>
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        {showClearConfirm ? (
                          <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-xl border border-rose-100">
                            <span className="text-[10px] font-bold text-rose-600 uppercase px-2">Zeker weten?</span>
                            <button 
                              disabled={isClearing}
                              onClick={handleClearDatabase}
                              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-colors disabled:opacity-50"
                            >
                              {isClearing ? 'Bezig...' : 'Ja, wis alles'}
                            </button>
                            <button 
                              disabled={isClearing}
                              onClick={() => setShowClearConfirm(false)}
                              className="px-3 py-1.5 bg-white text-slate-400 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                            >
                              Annuleer
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowClearConfirm(true)}
                            className="px-4 py-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Database leegmaken
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button 
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    onClick={handleExport}
                  >
                    <Download className="w-4 h-4" />
                    Export naar Excel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 sm:px-6 border-t border-slate-100 mt-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Candy className="w-5 h-5 text-rose-400" />
          <span className="font-bold text-slate-900">De Snoepwinkel</span>
        </div>
        <p className="text-sm text-slate-400">
          © 2026 Kentalis Ambulante Dienst. Alle rechten voorbehouden.
        </p>
        <p className="text-[10px] text-slate-300 mt-2 uppercase tracking-widest">v1.0.1 - Update: 11 april 2026</p>
      </footer>
    </div>
  );
}
