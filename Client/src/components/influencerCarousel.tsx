'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import image from "../public/images/influencer.png"

interface InfluencerCard {
  date: string
  title: string
  performer: string
  image: any
}

const influencerCards: InfluencerCard[] = [
  { date: '21 MAY', title: 'Sunday Salsa', performer: 'DEBORAH DE LUCA', image: image },
  { date: '22 MAY', title: 'Monday Blues', performer: 'JOHN DOE', image: image },
  { date: '23 MAY', title: 'Tuesday Jazz', performer: 'JANE SMITH', image: image },
  { date: '24 MAY', title: 'Wednesday Rock', performer: 'ROCK BAND', image: image },
  { date: '25 MAY', title: 'Thursday Pop', performer: 'POP STAR', image: image },
  { date: '26 MAY', title: 'Friday Funk', performer: 'FUNK BAND', image: image },
]

export default function InfluencerCarousel() {
  const router = useRouter()

  const handleShowAllInfluencers = () => {
    router.push('/influencers') // Adjust the route as needed
  }

  return (
    <div className='influencer w-full bg-transparent text-white p-10'>
      <div className="w-full bg-transparent text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Influencers Shaping the Community</h2>
          <Button variant="outline" onClick={handleShowAllInfluencers}>Show All Influencers</Button>
        </div>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {influencerCards.map((card, index) => (
            <SwiperSlide key={index}>
              <Card className="bg-gray-950 border-none">
                <CardContent className="p-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <div className='flex justify-between items-center'>
                      <h1 className="text-xl font-bold mb-2">{card.performer}</h1>
                      <h4>F1 Racer</h4>
                    </div>
                    <Button className="w-[100px] bg-[#8A44CB] text-white font-bold rounded-[15px]">More Info</Button>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}