import {
  Flame, Zap, Shield, Sparkles, Sword, ArrowRight, Users, Skull,
  Snowflake, Eye, Wind, Droplets, Magnet, Heart, Volume2, Clock, Waves,
  Moon, Gauge, Sun, CircleDot, Target, Crosshair
} from 'lucide-react'

export const getSchoolIcon = (school: string) => {
  switch (school) {
    case 'feu':
      return Flame
    case 'givre':
      return Snowflake
    case 'électricité':
    case 'electricite':
      return Zap
    case 'kinesthésique':
    case 'kinestesique':
      return Gauge
    case 'lumière':
    case 'lumiere':
      return Sun
    case 'ombre':
      return Moon
    case 'biométabolique':
    case 'biométabolique':
      return Skull
    case 'quantique':
      return Sparkles
    case 'pure':
      return CircleDot
    case 'aérocinétique':
    case 'aerocinétique':
    case 'aerocinétique':
      return Wind
    case 'hydrodynamique':
      return Droplets
    case 'magnétique':
    case 'magnetique':
      return Magnet
    case 'bioarcanotechnique':
    case 'bio-arcanotechnie':
      return Heart
    case 'sonique':
      return Volume2
    case 'chronodynamique':
      return Clock
    case 'gravitonique':
      return Waves
    case 'illusion':
      return Eye
    case 'martial':
      return Sword
    case 'balistique':
      return Target
    default:
      return Sparkles
  }
}

export const getSchoolColor = (school: string) => {
  switch (school) {
    case 'feu':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'givre':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
    case 'électricité':
    case 'electricite':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'kinesthésique':
    case 'kinestesique':
      return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
    case 'lumière':
    case 'lumiere':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    case 'ombre':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    case 'biométabolique':
    case 'biométabolique':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300'
    case 'quantique':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'pure':
      return 'bg-white text-gray-800 dark:bg-gray-200 dark:text-gray-800 border border-gray-300'
    case 'aérocinétique':
    case 'aerocinétique':
    case 'aerocinétique':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
    case 'hydrodynamique':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'magnétique':
    case 'magnetique':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'bioarcanotechnique':
    case 'bio-arcanotechnie':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    case 'sonique':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'chronodynamique':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
    case 'gravitonique':
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
    case 'illusion':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    case 'martial':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
    case 'balistique':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'destruction':
      return Skull
    case 'protection':
      return Shield
    case 'arme':
      return Sword
    case 'deplacement':
    case 'déplacement':
      return ArrowRight
    case 'alteration':
    case 'altération':
      return Sparkles
    case 'amelioration':
    case 'amélioration':
      return Users
    case 'affliction':
    default:
      return Sparkles
  }
}

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'destruction':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'protection':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'alteration':
    case 'altération':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'amelioration':
    case 'amélioration':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'deplacement':
    case 'déplacement':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'arme':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    case 'affliction':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}