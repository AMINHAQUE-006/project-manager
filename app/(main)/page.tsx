import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FolderKanban, Users, Zap, Layout, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-4 bg-gradient-to-b from-white to-gray-50 text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full">
          🚀 v2.0 Now Available
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
          Manage Projects with <span className="text-blue-600">Unmatched Speed</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one workspace for your team. Plan, track, and collaborate on projects 
          in real-time without the clutter.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
              Get Started for Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
              See How It Works
            </Button>
          </Link>
        </div>
        
        {/* Abstract visual/preview */}
        <div className="mt-16 w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 p-2 border-b flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-8 grid md:grid-cols-3 gap-6 opacity-80 pointer-events-none">
             {/* Mock Dashboard Preview */}
             <div className="space-y-4">
                <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                <div className="h-32 bg-blue-50 rounded-lg border-2 border-blue-100 p-4"></div>
                <div className="h-32 bg-gray-50 rounded-lg border-2 border-gray-100 p-4"></div>
             </div>
             <div className="space-y-4">
                <div className="h-8 bg-gray-100 rounded w-1/2"></div>
                <div className="h-32 bg-yellow-50 rounded-lg border-2 border-yellow-100 p-4"></div>
                <div className="h-24 bg-gray-50 rounded-lg border-2 border-gray-100 p-4"></div>
             </div>
             <div className="space-y-4">
                <div className="h-8 bg-gray-100 rounded w-2/3"></div>
                <div className="h-32 bg-green-50 rounded-lg border-2 border-green-100 p-4"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Powerful features designed for modern software teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gray-50/50 hover:bg-white transition-colors">
              <CardHeader>
                <FolderKanban className="w-10 h-10 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Kanban Boards</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Visualize work in progress. Move tasks through stages with an intuitive 
                drag-and-drop interface.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-50/50 hover:bg-white transition-colors">
              <CardHeader>
                <Users className="w-10 h-10 text-purple-600 mb-4" />
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Invite team members, assign tasks, and comment in real-time. Keep everyone 
                aligned and moving forward.
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-50/50 hover:bg-white transition-colors">
              <CardHeader>
                <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                <CardTitle className="text-xl">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                See changes as they happen. No need to refresh. Stay in sync with your 
                team effortlessly.
              </CardContent>
            </Card>
            
             <Card className="border-0 shadow-lg bg-gray-50/50 hover:bg-white transition-colors">
              <CardHeader>
                <Layout className="w-10 h-10 text-pink-600 mb-4" />
                <CardTitle className="text-xl">Modern UI</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                 Clean, distraction-free interface built for focus. Dark mode support included.
              </CardContent>
            </Card>

             <Card className="border-0 shadow-lg bg-gray-50/50 hover:bg-white transition-colors">
              <CardHeader>
                <Shield className="w-10 h-10 text-green-600 mb-4" />
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Your data is safe with us. Enterprise-grade security for teams of all sizes.
              </CardContent>
            </Card>

             <Card className="border-0 shadow-lg bg-gray-50/50 hover:bg-white transition-colors">
              <CardHeader>
                <CheckCircle className="w-10 h-10 text-orange-600 mb-4" />
                <CardTitle className="text-xl">Task Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Never lose track of a bug or feature request again. Prioritize what matters most.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to streamline your workflow?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who use our platform to build better products, faster.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-6 h-auto">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p className="mb-4">&copy; {new Date().getFullYear()} ProjectManager. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="#" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
