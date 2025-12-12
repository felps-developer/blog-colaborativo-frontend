import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import type { PostListItem } from '@/types/posts';
import { formatDate } from '@/utils';

interface PostCardProps {
  post: PostListItem;
  showActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
  linkTo?: string;
}

export function PostCard({ 
  post, 
  showActions = false, 
  onEdit, 
  onDelete,
  deletingId,
  linkTo 
}: PostCardProps) {
  const cardContent = (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-gray-200 hover:border-[#0052A5]/30 bg-white group overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-[#0052A5] transition-colors mb-3 leading-tight">
          {post.title}
        </CardTitle>
        <CardDescription className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <div className="bg-[#0052A5]/10 rounded-full p-1.5">
              <User className="h-3.5 w-3.5 text-[#0052A5]" />
            </div>
            <span className="font-medium">{post.author.name}</span>
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.created_at)}
          </span>
        </CardDescription>
      </CardHeader>
      {showActions && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {linkTo && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                asChild
              >
                <Link href={linkTo}>Ver</Link>
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post.id)}
                className="border-[#0052A5] text-[#0052A5] hover:bg-[#0052A5] hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(post.id)}
                disabled={deletingId === post.id}
                className="px-3"
              >
                {deletingId === post.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  if (linkTo && !showActions) {
    return (
      <Link href={linkTo}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

