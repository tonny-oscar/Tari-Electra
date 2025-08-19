'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

export default function CreateHomepageProduct() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !imageUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/homepage-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, price, imageUrl }),
      });

      if (res.ok) {
        router.push('/admin/homepage-products');
      } else {
        alert('Failed to create product');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user || !isAdmin) return <p>Access denied.</p>;

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create Homepage Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Enter product price"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <Input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              required
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Create Product'}
          </Button>
        </form>
      </main>
    </>
  );
}
