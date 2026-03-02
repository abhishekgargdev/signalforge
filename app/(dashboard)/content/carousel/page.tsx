import { redirect } from 'next/navigation';

export default function ContentCarouselRedirect() {
  redirect('/content?tab=carousel');
}
