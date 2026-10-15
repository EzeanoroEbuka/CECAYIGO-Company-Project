import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { Package, Users, DollarSign, ShoppingCart, PlusCircle, Edit, Trash2, LogOut, MessageSquare, MessageCircle, ShieldCheck, ShieldAlert, Video, UserCog, Star } from 'lucide-react';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { feedbackService, FeedbackSubmission } from '@/services/feedbackService';
import { guideService, AdminGuideItem } from '@/services/guideService';
import { useAuth, UserProfile } from '@/contexts/AuthContext';

interface Order {
  id: string;
  total: number;
  customerEmail: string;
  customerName: string;
  status: string;
  createdAt: any;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  category: string;
  inStock: boolean;
  featured: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin: authIsAdmin, getAllUsers, updateUserRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>([]);
  const [guides, setGuides] = useState<AdminGuideItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'product' | 'blog' | 'guide' }>({ id: '', type: 'product' });
  // Guide form state
  const [guideFormOpen, setGuideFormOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Partial<AdminGuideItem> | null>(null);
  const [savingGuide, setSavingGuide] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        router.push('/admin/login');
      } else {
        // User is logged in, fetch data
        fetchData();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);

      // Fetch orders
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      
      // Count new/pending orders
      const pendingOrders = ordersData.filter(order => order.status === 'pending');
      setNewOrdersCount(pendingOrders.length);

      // Fetch blog posts
      const blogPostsQuery = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
      const blogPostsSnapshot = await getDocs(blogPostsQuery);
      const blogPostsData = blogPostsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setBlogPosts(blogPostsData);

      // Fetch complaints and customer feedback
      try {
        const fbData = await feedbackService.getAllFeedback();
        setFeedbackList(fbData);
      } catch (err) {
        console.warn('Could not fetch feedback:', err);
      }

      // Fetch video guides
      try {
        const guidesData = await guideService.getAllGuides();
        setGuides(guidesData);
      } catch (err) {
        console.warn('Could not fetch guides:', err);
      }

      // Fetch all users
      try {
        const usersData = await getAllUsers();
        setAllUsers(usersData);
      } catch (err) {
        console.warn('Could not fetch users:', err);
      }

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        totalCustomers: new Set(ordersData.map(order => order.customerEmail || '')).size
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const handleUpdateFeedbackStatus = async (id: string, newStatus: "open" | "in_review" | "resolved") => {
    try {
      await feedbackService.updateFeedbackStatus(id, newStatus);
      setFeedbackList(prev => prev.map(f => (f.id === id || f.ticketId === id ? { ...f, status: newStatus } : f)));
      toast.success(`Complaint/Feedback marked as ${newStatus.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        featured: !currentStatus
      });
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, featured: !currentStatus } 
          : product
      ));
      
      toast.success(`Product ${!currentStatus ? 'added to' : 'removed from'} featured products`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const confirmDelete = (id: string, type: 'product' | 'blog') => {
    setItemToDelete({ id, type });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete.type === 'product') {
        await deleteDoc(doc(db, 'products', itemToDelete.id));
        setProducts(products.filter(product => product.id !== itemToDelete.id));
        toast.success('Product deleted successfully');
      } else {
        await deleteDoc(doc(db, 'blogPosts', itemToDelete.id));
        setBlogPosts(blogPosts.filter(post => post.id !== itemToDelete.id));
        toast.success('Blog post deleted successfully');
      }
      
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      toast.error(`Failed to delete ${itemToDelete.type}`);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // Handle updating the role of a user
  const handleUpdateUserRole = async (uid: string, newRole: 'admin' | 'customer') => {
    try {
      await updateUserRole(uid, newRole);
      setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch {}
  };

  // Save / update a video guide
  const handleSaveGuide = async () => {
    if (!editingGuide?.title || !editingGuide?.videoEmbedUrl) {
      toast.error('Please fill in at least a Title and Video Embed URL.');
      return;
    }
    try {
      setSavingGuide(true);
      const guideToSave: AdminGuideItem = {
        id: editingGuide.id || `guide-${Date.now()}`,
        category: editingGuide.category || 'general',
        title: editingGuide.title || '',
        videoTitle: editingGuide.videoTitle || editingGuide.title || '',
        videoEmbedUrl: editingGuide.videoEmbedUrl || '',
        duration: editingGuide.duration || '',
        summary: editingGuide.summary || '',
        productId: editingGuide.productId || '',
        productName: editingGuide.productName || '',
        dos: editingGuide.dos || [],
        donts: editingGuide.donts || [],
      };
      await guideService.saveGuide(guideToSave);
      const updatedGuides = await guideService.getAllGuides();
      setGuides(updatedGuides);
      setGuideFormOpen(false);
      setEditingGuide(null);
      toast.success('Video guide saved successfully!');
    } catch (err) {
      toast.error('Failed to save guide.');
    } finally {
      setSavingGuide(false);
    }
  };

  // Delete a guide
  const handleDeleteGuide = async (id: string) => {
    try {
      await guideService.deleteGuide(id);
      setGuides(prev => prev.filter(g => g.id !== id));
      toast.success('Guide deleted.');
    } catch {
      toast.error('Failed to delete guide.');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | CeC Ayigo</title>
        <meta name='description' content='Admin dashboard for CeC Ayigo' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>

      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <header className='bg-white dark:bg-gray-800 shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Admin Dashboard</h1>
            <Button variant='ghost' onClick={handleLogout} className='flex items-center gap-2'>
              <LogOut className='h-4 w-4' />
              Logout
            </Button>
          </div>
        </header>

        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6 flex items-center'>
                <div className='rounded-full p-3 bg-blue-100 dark:bg-blue-900 mr-4'>
                  <Package className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Products</p>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>{stats.totalProducts}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className='p-6 flex items-center'>
                <div className='rounded-full p-3 bg-green-100 dark:bg-green-900 mr-4'>
                  <ShoppingCart className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Orders</p>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>{stats.totalOrders}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className='p-6 flex items-center'>
                <div className='rounded-full p-3 bg-purple-100 dark:bg-purple-900 mr-4'>
                  <Users className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Customers</p>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>{stats.totalCustomers}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className='p-6 flex items-center'>
                <div className='rounded-full p-3 bg-amber-100 dark:bg-amber-900 mr-4'>
                  <DollarSign className='h-6 w-6 text-amber-600 dark:text-amber-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Revenue</p>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>₦{stats.totalRevenue.toFixed(2)}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue='products' className='space-y-6'>
            <TabsList className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg flex flex-wrap gap-1'>
              <TabsTrigger value='products'>Products</TabsTrigger>
              <TabsTrigger value='orders'>Orders</TabsTrigger>
              <TabsTrigger value='feedback' className='flex items-center gap-1.5'>
                <MessageSquare className='h-3.5 w-3.5 text-brand-red' />
                Complaints & Feedback
                {feedbackList.filter(f => f.status === 'open').length > 0 && (
                  <span className='ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-red text-white'>
                    {feedbackList.filter(f => f.status === 'open').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value='customers'>Customers</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
              <TabsTrigger value='blog'>Blog Posts</TabsTrigger>
            </TabsList>
            
            <TabsContent value='products' className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Manage Products</h2>
                <Link href='/admin/products/new'>
                  <Button className='bg-primary hover:bg-primary/90 flex items-center gap-2'>
                    <PlusCircle className='h-4 w-4' />
                    Add New Product
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>Product List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='px-6 py-3'>Product</th>
                          <th className='px-6 py-3'>Price</th>
                          <th className='px-6 py-3'>Category</th>
                          <th className='px-6 py-3'>Status</th>
                          <th className='px-6 py-3'>Featured</th>
                          <th className='px-6 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? (
                          products.map((product) => (
                            <tr key={product.id} className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                              <td className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                                {product.name}
                              </td>
                              <td className='px-6 py-4'>
                              ₦{product.discountedPrice || product.price}
                              </td>
                              <td className='px-6 py-4'>
                                {product.category}
                              </td>
                              <td className='px-6 py-4'>
                                <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td className='px-6 py-4'>
                                <Button 
                                  variant={product.featured ? 'default' : 'outline'} 
                                  size='sm'
                                  onClick={() => toggleFeatured(product.id, product.featured)}
                                  className={product.featured ? 'bg-primary text-white' : 'border-gray-300 text-gray-700 dark:text-gray-300'}
                                >
                                  {product.featured ? 'Featured' : 'Not Featured'}
                                </Button>
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex space-x-2'>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='h-8 w-8 p-0'
                                    onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                  >
                                    <Edit className='h-4 w-4' />
                                  </Button>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                                    onClick={() => confirmDelete(product.id, 'product')}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                            <td colSpan={6} className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'>
                              No products found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value='orders' className='space-y-6'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Recent Orders</h2>
              
              <Card>
                <CardContent className='p-6'>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='px-6 py-3'>Order ID</th>
                          <th className='px-6 py-3'>Customer</th>
                          <th className='px-6 py-3'>Date</th>
                          <th className='px-6 py-3'>Total</th>
                          <th className='px-6 py-3'>Status</th>
                          <th className='px-6 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.id} className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                              <td className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                                #{order.id.slice(0, 8)}
                              </td>
                              <td className='px-6 py-4'>
                                {order.customerName || order.customerEmail}
                              </td>
                              <td className='px-6 py-4'>
                                {order.createdAt?.toDate ? 
                                  format(order.createdAt.toDate(), 'MMM dd, yyyy') : 
                                  'N/A'}
                              </td>
                              <td className='px-6 py-4'>
                              ₦{order.total?.toFixed(2) || '0.00'}
                              </td>
                              <td className='px-6 py-4'>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {order.status || 'Pending'}
                                </span>
                              </td>
                              <td className='px-6 py-4'>
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Button variant='outline' size='sm'>
                                    View Details
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                            <td colSpan={6} className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'>
                              No orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* VIDEO GUIDES TAB */}
            <TabsContent value='guides' className='space-y-6'>
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <Video className='h-5 w-5 text-brand-red' /> Video Guides Management
                  </h2>
                  <p className='text-xs text-gray-500 mt-0.5'>Add or remove product usage & safety video guides shown on the guides page.</p>
                </div>
                <Button 
                  className='bg-primary hover:bg-primary/90 flex items-center gap-2'
                  onClick={() => { setEditingGuide({ category: 'general', dos: [], donts: [] }); setGuideFormOpen(true); }}
                >
                  <PlusCircle className='h-4 w-4' /> Add New Guide
                </Button>
              </div>

              {/* Guide Add / Edit Form */}
              {guideFormOpen && editingGuide !== null && (
                <Card className='border-brand-red/30'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base text-brand-red flex items-center gap-2'>
                      <Video className='h-4 w-4' /> {editingGuide.id ? 'Edit Video Guide' : 'Add New Video Guide'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>Guide Title *</label>
                        <Input 
                          placeholder='e.g. LED Floodlight Mounting Guide'
                          value={editingGuide.title || ''}
                          onChange={e => setEditingGuide(g => ({ ...g, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>Category *</label>
                        <select 
                          value={editingGuide.category || 'general'}
                          onChange={e => setEditingGuide(g => ({ ...g, category: e.target.value as any }))}
                          className='w-full h-10 px-3 rounded-md border border-input bg-background text-sm'
                        >
                          <option value='lighting'>LED & Floodlights</option>
                          <option value='breakers'>Smart Breakers & DB</option>
                          <option value='solar'>Solar Inverters & Batteries</option>
                          <option value='wiring'>Wiring & Cables</option>
                          <option value='general'>General Safety</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>YouTube/Video Embed URL *</label>
                        <Input 
                          placeholder='https://www.youtube.com/embed/VIDEO_ID'
                          value={editingGuide.videoEmbedUrl || ''}
                          onChange={e => setEditingGuide(g => ({ ...g, videoEmbedUrl: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>Video Duration</label>
                        <Input 
                          placeholder='e.g. 5:30 mins'
                          value={editingGuide.duration || ''}
                          onChange={e => setEditingGuide(g => ({ ...g, duration: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>Video Title</label>
                        <Input 
                          placeholder='e.g. CeC Floodlight Earthing & Mounting Demo'
                          value={editingGuide.videoTitle || ''}
                          onChange={e => setEditingGuide(g => ({ ...g, videoTitle: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>Related Product Name</label>
                        <Input 
                          placeholder='e.g. CeC Pro 100W LED Floodlight'
                          value={editingGuide.productName || ''}
                          onChange={e => setEditingGuide(g => ({ ...g, productName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>Guide Summary</label>
                      <textarea 
                        placeholder='Brief summary of what this guide covers...'
                        value={editingGuide.summary || ''}
                        onChange={e => setEditingGuide(g => ({ ...g, summary: e.target.value }))}
                        className='w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none'
                      />
                    </div>
                    <p className='text-xs text-gray-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 rounded-lg'>
                      <strong>Tip:</strong> After saving, you can add detailed Do&apos;s &amp; Don&apos;ts from the Guide detail page. The guide will immediately appear on the public Video Guides page.
                    </p>
                    <div className='flex items-center gap-3'>
                      <Button 
                        onClick={handleSaveGuide} 
                        disabled={savingGuide}
                        className='bg-brand-red hover:bg-brand-red-dark text-white'
                      >
                        {savingGuide ? 'Saving...' : 'Save Guide'}
                      </Button>
                      <Button 
                        variant='outline' 
                        onClick={() => { setGuideFormOpen(false); setEditingGuide(null); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>Current Video Guides ({guides.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='px-4 py-3'>Title</th>
                          <th className='px-4 py-3'>Category</th>
                          <th className='px-4 py-3'>Duration</th>
                          <th className='px-4 py-3'>Product</th>
                          <th className='px-4 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guides.length > 0 ? (
                          guides.map((guide) => (
                            <tr key={guide.id} className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                              <td className='px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs'>
                                <span className='line-clamp-1'>{guide.title}</span>
                                {guide.videoEmbedUrl && (
                                  <a href={guide.videoEmbedUrl} target='_blank' rel='noopener noreferrer' className='text-[11px] text-brand-blue hover:underline truncate block mt-0.5'>
                                    {guide.videoEmbedUrl.substring(0, 50)}...
                                  </a>
                                )}
                              </td>
                              <td className='px-4 py-3'>
                                <Badge className='text-[10px] font-semibold'>{guide.category}</Badge>
                              </td>
                              <td className='px-4 py-3 text-xs text-gray-500'>{guide.duration || 'N/A'}</td>
                              <td className='px-4 py-3 text-xs text-gray-500 max-w-[120px]'>
                                <span className='line-clamp-1'>{guide.productName || '-'}</span>
                              </td>
                              <td className='px-4 py-3'>
                                <div className='flex space-x-2'>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='h-8 w-8 p-0'
                                    onClick={() => { setEditingGuide(guide); setGuideFormOpen(true); }}
                                  >
                                    <Edit className='h-4 w-4' />
                                  </Button>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                                    onClick={() => { setItemToDelete({ id: guide.id, type: 'guide' }); setDeleteConfirmOpen(true); }}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='bg-white dark:bg-gray-900'>
                            <td colSpan={5} className='px-4 py-8 text-center text-gray-500'>
                              No video guides added yet. Click &ldquo;Add New Guide&rdquo; to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* USERS & ROLES TAB */}
            <TabsContent value='users' className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <UserCog className='h-5 w-5 text-brand-blue' /> Users & Role Management
                </h2>
                <p className='text-xs text-gray-500 mt-0.5'>
                  Manage customer accounts. Promote trusted users to Admin or revoke admin privileges.
                </p>
              </div>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>All Registered Users ({allUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='px-4 py-3'>Name</th>
                          <th className='px-4 py-3'>Email</th>
                          <th className='px-4 py-3'>Phone</th>
                          <th className='px-4 py-3'>Role</th>
                          <th className='px-4 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.length > 0 ? (
                          allUsers.map((u) => (
                            <tr key={u.uid} className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                              <td className='px-4 py-3 font-medium text-gray-900 dark:text-white'>
                                <div className='flex items-center gap-2'>
                                  <div className='w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold flex-shrink-0'>
                                    {u.displayName?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                  <span className='text-xs'>{u.displayName || 'Unknown'}</span>
                                </div>
                              </td>
                              <td className='px-4 py-3 text-xs text-gray-600 dark:text-gray-400'>{u.email}</td>
                              <td className='px-4 py-3 text-xs text-gray-500'>{u.phone || '-'}</td>
                              <td className='px-4 py-3'>
                                <Badge className={`text-[10px] font-bold ${
                                  u.role === 'admin' 
                                    ? 'bg-brand-red/15 text-brand-red border-brand-red/20' 
                                    : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {u.role === 'admin' ? (
                                    <><ShieldCheck className='h-3 w-3 inline mr-1' />Admin</>
                                  ) : (
                                    'Customer'
                                  )}
                                </Badge>
                              </td>
                              <td className='px-4 py-3'>
                                {u.role === 'admin' ? (
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    className='text-xs border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400'
                                    onClick={() => handleUpdateUserRole(u.uid, 'customer')}
                                  >
                                    <ShieldAlert className='h-3.5 w-3.5 mr-1' />
                                    Revoke Admin
                                  </Button>
                                ) : (
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    className='text-xs border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400'
                                    onClick={() => handleUpdateUserRole(u.uid, 'admin')}
                                  >
                                    <ShieldCheck className='h-3.5 w-3.5 mr-1' />
                                    Make Admin
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='bg-white dark:bg-gray-900'>
                            <td colSpan={5} className='px-4 py-8 text-center text-gray-500'>
                              No registered users found yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='blog' className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Manage Blog Posts</h2>
                <Link href='/admin/blogs/new'>
                  <Button className='bg-primary hover:bg-primary/90 flex items-center gap-2'>
                    <PlusCircle className='h-4 w-4' />
                    Add New Blog Post
                  </Button>
                </Link>
              </div>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>Blog Post List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='px-6 py-3'>Title</th>
                          <th className='px-6 py-3'>Author</th>
                          <th className='px-6 py-3'>Date</th>
                          <th className='px-6 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogPosts.length > 0 ? (
                          blogPosts.map((post) => (
                            <tr key={post.id} className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                              <td className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                                {post.title}
                              </td>
                              <td className='px-6 py-4'>
                                {post.author}
                              </td>
                              <td className='px-6 py-4'>
                                {post.date?.toDate ? 
                                  format(post.date.toDate(), 'MMM dd, yyyy') : 
                                  'N/A'}
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex space-x-2'>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='h-8 w-8 p-0'
                                    onClick={() => router.push(`/admin/blogs/edit/${post.id}`)}
                                  >
                                    <Edit className='h-4 w-4' />
                                  </Button>
                                  <Button 
                                    variant='outline' 
                                    size='sm' 
                                    className='h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                                    onClick={() => confirmDelete(post.id, 'blog')}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
                            <td colSpan={4} className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'>
                              No blog posts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaints & Feedback Tab Content */}
            <TabsContent value='feedback' className='space-y-6'>
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <MessageSquare className='h-5 w-5 text-brand-red' />
                    Customer Complaints & Quality Feedback
                  </h2>
                  <p className='text-xs text-gray-500 mt-0.5'>
                    Review incoming warranty complaints, defect reports, and customer feedback.
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>Resolution Queue ({feedbackList.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left'>
                      <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th className='px-4 py-3'>Ticket ID / Date</th>
                          <th className='px-4 py-3'>Type & Priority</th>
                          <th className='px-4 py-3'>Customer Details</th>
                          <th className='px-4 py-3'>Product / Order Ref</th>
                          <th className='px-6 py-3'>Subject & Message</th>
                          <th className='px-4 py-3'>Status</th>
                          <th className='px-4 py-3'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbackList.length > 0 ? (
                          feedbackList.map((item) => (
                            <tr key={item.id || item.ticketId} className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50'>
                              <td className='px-4 py-4'>
                                <span className='font-mono font-bold text-xs text-brand-red block'>{item.ticketId}</span>
                                <span className='text-[11px] text-gray-400'>
                                  {typeof item.createdAt === 'string' ? item.createdAt.substring(0, 10) : 'Recent'}
                                </span>
                              </td>
                              <td className='px-4 py-4 space-y-1'>
                                <Badge className={`text-[10px] font-bold uppercase ${
                                  item.type === 'complaint' 
                                    ? 'bg-red-100 text-red-800' 
                                    : item.type === 'warranty' 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {item.type}
                                </Badge>
                                <div>
                                  <Badge variant='outline' className={`text-[10px] ${
                                    item.priority === 'urgent' ? 'border-red-500 text-red-600 font-bold' : 'text-gray-500'
                                  }`}>
                                    {item.priority}
                                  </Badge>
                                </div>
                              </td>
                              <td className='px-4 py-4'>
                                <div className='font-semibold text-gray-900 dark:text-white text-xs'>{item.name}</div>
                                <div className='text-[11px] text-gray-500'>{item.email}</div>
                                <div className='text-[11px] text-green-700 font-mono'>{item.phone}</div>
                              </td>
                              <td className='px-4 py-4 text-xs'>
                                {item.productName && <div className='font-medium text-gray-800'>{item.productName}</div>}
                                {item.orderNumber && <div className='text-[11px] text-gray-500 font-mono'>Ref: {item.orderNumber}</div>}
                                {!item.productName && !item.orderNumber && <span className='text-gray-400'>N/A</span>}
                              </td>
                              <td className='px-6 py-4 max-w-xs'>
                                <div className='font-bold text-xs text-gray-900 mb-0.5'>{item.subject}</div>
                                <p className='text-xs text-gray-600 line-clamp-2'>{item.message}</p>
                              </td>
                              <td className='px-4 py-4'>
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateFeedbackStatus(item.id || item.ticketId, e.target.value as any)}
                                  className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                                    item.status === 'open' 
                                      ? 'bg-red-50 border-red-200 text-red-700' 
                                      : item.status === 'in_review' 
                                      ? 'bg-amber-50 border-amber-200 text-amber-700' 
                                      : 'bg-green-50 border-green-200 text-green-700'
                                  }`}
                                >
                                  <option value='open'>Open</option>
                                  <option value='in_review'>In Review</option>
                                  <option value='resolved'>Resolved</option>
                                </select>
                              </td>
                              <td className='px-4 py-4'>
                                {item.phone && (
                                  <a
                                    href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.name}, this is CeC Ayigo Quality Support regarding your ticket ${item.ticketId}.`)}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-semibold'
                                  >
                                    <MessageCircle className='h-3 w-3' />
                                    Reply
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className='px-6 py-8 text-center text-gray-500'>
                              No feedback or complaints submitted yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete.type === 'guide') {
                  handleDeleteGuide(itemToDelete.id);
                  setDeleteConfirmOpen(false);
                } else {
                  handleDelete();
                }
              }} 
              className='bg-red-500 hover:bg-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}