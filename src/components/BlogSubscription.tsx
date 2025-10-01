'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';

export function BlogSubscription() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'blogSubscriptions'), {
        email: email.toLowerCase().trim(),
        subscribedAt: new Date().toISOString(),
        status: 'active'
      });

      setIsSubscribed(true);
      setEmail('');
      toast({
        title: 'Subscribed Successfully!',
        description: 'You\'ll receive our latest blog updates via email.',
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Unable to subscribe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Successfully Subscribed!
          </h3>
          <p className="text-green-700">
            Thank you for subscribing to our blog updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-semibold mb-2">Subscribe to Our Blog</h3>
          <p className="text-muted-foreground text-sm">
            Get the latest updates on electrical solutions and industry insights.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}