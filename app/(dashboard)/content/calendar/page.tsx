import { redirect } from 'next/navigation';

export default function ContentCalendarRedirect() {
  redirect('/content?tab=calendar');
}
