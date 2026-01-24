import { SmsAPI } from './api'
import { SMS_ENABLED } from '@/configuration'
import { tg_api } from './tgapi'
import db from '@/db/drizzle'
import { eq } from 'drizzle-orm'
import { student, guardian } from '@/db/schema'

export const normalize = (num: string | null): string | null => {
  if (!num) return null;

  let digits = num.replace(/\D/g, "");

  if (digits.startsWith("63")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  return digits.length === 10 ? digits : null;
};

export const sendSMSGuardianNotif = async (student_id: string, entry: 'IN' | 'OUT') => {
  const [studentData] = await db.select().from(student).where(eq(student.id, student_id)).innerJoin(guardian, eq(guardian.student_id, student.id));
  
  const notif_msg = `Good Day ${studentData.guardian.firstname + " " + studentData.guardian.lastname}, your child ${studentData.student.firstname + ' ' + studentData.student.lastname} has ${entry === 'IN' ? 'entered' : 'exited'} the school at 8:00 AM today.`;
  
  if(SMS_ENABLED) {
    const data = await SmsAPI(normalize(studentData.guardian.phone_number), notif_msg);
    
    tg_api(encodeURIComponent(`<b>Guardian Alert</b>\n[Debug Notification]\n\n<b>IProgSms</b>: ${data?.message}\n<b>Phone</b>: ${normalize(studentData.guardian.phone_number)}\n<b>Child</b>: ${studentData.student.firstname + ' ' + studentData.student.lastname}\n<b>Guardian</b>: ${studentData.guardian.firstname + " " + studentData.guardian.lastname}\n\n<i>Received from Server (LCC Gatepass Server)</i>`));
    
    if(data.status === 200) return data;
  } else {
    const data = await tg_api(notif_msg);
    return data;
  }
}