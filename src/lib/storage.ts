import { supabase } from './supabase'

export async function uploadFacePhoto(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/face.${ext}`
  const { error } = await supabase.storage
    .from('face-photos')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('face-photos').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadShopPhoto(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/shop.${ext}`
  const { error } = await supabase.storage
    .from('shop-photos')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('shop-photos').getPublicUrl(path)
  return data.publicUrl
}
