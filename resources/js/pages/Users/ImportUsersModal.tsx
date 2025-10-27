import React, { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

export default function ImportUsersModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first.');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    router.post(route('users.import'), formData, {
      onSuccess: () => {
        setOpen(false);
        setFile(null);
      },
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white">
        <Upload size={16} /> Import Users
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Users from Excel</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Excel File (.xlsx, .xls, .csv)</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Importing...' : 'Import'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
