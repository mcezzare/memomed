import { ArrowLeft, Share, PlusSquare, MoreVertical, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/">
              <ArrowLeft />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline">Install MemoMed</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone />
                        Add to Home Screen
                    </CardTitle>
                    <CardDescription>
                        Follow these instructions to install the MemoMed app on your phone for easy access and offline use.
                    </CardDescription>
                </CardHeader>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle>On iOS (iPhone/iPad)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>1. Open this website in the <strong>Safari</strong> browser.</p>
              <p>2. Tap the 'Share' button at the bottom of the screen. It looks like a square with an arrow pointing up.</p>
              <div className="flex justify-center my-4">
                <Share className="h-8 w-8 text-primary" />
              </div>
              <p>3. Scroll down in the share menu and tap on <strong>'Add to Home Screen'</strong>.</p>
               <div className="flex justify-center my-4">
                <PlusSquare className="h-8 w-8 text-primary" />
              </div>
              <p>4. Confirm the name of the app and tap 'Add'. The app icon will now appear on your home screen.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>On Android (Chrome)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>1. Open this website in the <strong>Chrome</strong> browser.</p>
              <p>2. Tap the three-dot menu icon in the top-right corner.</p>
               <div className="flex justify-center my-4">
                <MoreVertical className="h-8 w-8 text-primary" />
              </div>
              <p>3. From the menu, tap on <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.</p>
               <div className="flex justify-center my-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <p>4. Follow the on-screen prompts to install the app. The app icon will be added to your home screen.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
