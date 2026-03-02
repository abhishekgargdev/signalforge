import { redirect } from 'next/navigation';

export default function ContentNewRedirect() {
  redirect('/content?tab=wizard');
}
