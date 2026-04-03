import { useState, useMemo, useEffect } from 'react';
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
  LogIn,
  LogOut
} from 'lucide-react';
import { courses, Course } from './data/courses';
import { auth, db } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  getDocFromServer,
  doc
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
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        if (result.user.email && admins.includes(result.user.email)) {
          setIsAdminOpen(true);
        } else {
          alert('Toegang geweigerd: Alleen de beheerder kan dit overzicht bekijken.');
          await signOut(auth);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const handleLogout = () => signOut(auth);

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
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Welkom in de Snoepwinkel! 🍭</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Kies uit ons uitgebreide aanbod van scholingen. Of je nu op zoek bent naar externe expertise, 
                    kennis van collega's of inspirerende congressen, hier vind je de perfecte 'snoepjes' voor jouw professionele ontwikkeling.
                  </p>
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
              </section>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.button
                    key={course.id}
                    layoutId={`course-${course.id}`}
                    onClick={() => setSelectedCourse(course)}
                    className="group relative bg-white border border-slate-100 rounded-3xl p-6 text-left hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col h-full"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 font-bold text-lg border border-slate-100 group-hover:bg-rose-50 group-hover:text-rose-500 group-hover:border-rose-100 transition-colors">
                        {course.id}
                      </span>
                      <div className="flex gap-2">
                        {isInCart(course.id) && (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${CATEGORY_COLORS[course.category]}`}>
                          {CATEGORY_ICONS[course.category]}
                          {course.category}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      {course.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration.split('(')[0]}
                        </div>
                      )}
                      {course.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {course.location}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">Geen scholingen gevonden</h3>
                  <p className="text-slate-500">Probeer een andere zoekterm of categorie.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-rose-500 font-medium mb-8 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-rose-200 group-hover:bg-rose-50 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                Terug naar overzicht
              </button>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-rose-500/5 overflow-hidden">
                {/* Detail Header */}
                <div className={`p-8 sm:p-12 border-b ${CATEGORY_COLORS[selectedCourse.category].split(' ')[0]} bg-opacity-30`}>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-white text-slate-900 font-bold text-sm border border-slate-200 shadow-sm">
                      Scholing #{selectedCourse.id}
                    </span>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-white flex items-center gap-2 ${CATEGORY_COLORS[selectedCourse.category].split(' ').slice(1).join(' ')}`}>
                      {CATEGORY_ICONS[selectedCourse.category]}
                      {selectedCourse.category}
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed max-w-3xl">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Detail Content */}
                <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-10">
                    {selectedCourse.details && (
                      <section>
                        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-rose-500" />
                          Wat komt er aan bod?
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedCourse.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                              <span className="text-sm leading-snug">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {selectedCourse.learningGoals && (
                      <section>
                        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-500" />
                          Wat leer je?
                        </h4>
                        <div className="space-y-3">
                          {selectedCourse.learningGoals.map((goal, i) => (
                            <div key={i} className="flex items-center gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                                {i + 1}
                              </div>
                              <span className="text-sm text-slate-700 font-medium">{goal}</span>
                            </div>
                          ))}
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
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration?.split('(')[0]}
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
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Totaal aantal uren</span>
                    <span className="text-slate-900 font-bold">
                      {cart.reduce((acc, item) => {
                        const hours = item.duration?.match(/\d+/);
                        return acc + (hours ? parseInt(hours[0]) : 0);
                      }, 0)} uur (indicatie)
                    </span>
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
                      } catch (error) {
                        console.error("Error saving enrollment:", error);
                      } finally {
                        setIsSubmitting(false);
                      }

                      const email = 'N.uitermark@kentalis.nl';
                      const subject = encodeURIComponent(`Keuzelijst Scholingen 2026-2027 - ${userName.trim()}`);
                      const totalHours = cart.reduce((acc, item) => {
                        const hours = item.duration?.match(/\d+/);
                        return acc + (hours ? parseInt(hours[0]) : 0);
                      }, 0);
                      
                      const courseList = cart.map(item => `- [#${item.id}] ${item.title} (${item.duration || 'n.v.t.'})`).join('%0D%0A');
                      const body = encodeURIComponent(`Beste leidinggevende,%0D%0A%0D%0AHierbij de selectie van scholingen uit de Snoepwinkel van ${userName.trim()} voor het schooljaar 2026-2027:%0D%0A%0D%0A${courseList}%0D%0A%0D%0ATotaal indicatie uren: ${totalHours} uur.%0D%0A%0D%0AMet vriendelijke groet,%0D%0A${userName.trim()}`)
                        .replace(/%250D%250A/g, '%0D%0A'); // Fix double encoding if any
                      
                      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
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
                  <p className="text-xs text-slate-400 italic">
                    * Dit overzicht toont live data uit de database.
                  </p>
                  <button 
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    onClick={() => alert('Export functionaliteit is een demo.')}
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
      </footer>
    </div>
  );
}
