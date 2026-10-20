import oneSharingImage from '../assets/1-sharing room.webp'
import twoSharingImage from '../assets/2-sharing room image.webp'
import threeSharingImage from '../assets/3-sharing room.webp'

export type Room = {
  slug: string
  name: string
  shortName: string
  description: string
  image: string
  images: string[]
  monthlyPrice: number
  advance: number
  occupancy: string
}

export const rooms: Room[] = [
  {
    slug: 'one-sharing',
    name: 'One Sharing',
    shortName: '01',
    description: 'Your own peaceful, sunlit retreat with space to settle in and make it yours.',
    image: oneSharingImage,
    images: [oneSharingImage],
    monthlyPrice: 18000,
    advance: 36000,
    occupancy: 'Private room',
  },
  {
    slug: 'two-sharing',
    name: 'Two Sharing',
    shortName: '02',
    description: 'A bright, beautifully balanced room to share, with comfort for both of you.',
    image: twoSharingImage,
    images: [twoSharingImage],
    monthlyPrice: 12000,
    advance: 24000,
    occupancy: 'Per person · 2 sharing',
  },
  {
    slug: 'three-sharing',
    name: 'Three Sharing',
    shortName: '03',
    description: 'Easy, sociable living in a generous room made for good company and good rest.',
    image: threeSharingImage,
    images: [threeSharingImage],
    monthlyPrice: 9000,
    advance: 18000,
    occupancy: 'Per person · 3 sharing',
  },
]

export const formatRupees = (amount: number) =>
  `₹${new Intl.NumberFormat('en-IN').format(amount)}`
