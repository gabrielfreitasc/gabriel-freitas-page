import { RadialIntro } from "../animate-ui/components/community/radial-intro"
import ScrollFloat from "../ui/ScrollFloat"

export function StacksSection() {
    return(
        <section className="w-full min-h-screen flex flex-col items-center justify-start bg-neutral-950 py-20 px-8">
            <div className="w-full max-w-6xl mb-16">
                <ScrollFloat
                    animationDuration={1}
                    ease="back.inOut(2)"
                    scrollStart="top bottom"
                    scrollEnd="center top"
                    stagger={0.03}
                >
                    Tecnologias
                </ScrollFloat>
                <ScrollFloat
                    animationDuration={1}
                    ease="back.inOut(2)"
                    scrollStart="top bottom"
                    scrollEnd="center"
                    stagger={0.03}
                    textClassName="!text-sm"
                    containerClassName="!mt-0"
                >
                                            Tecnologias que eu tenho experiência

                </ScrollFloat>
                <div className="w-full flex items-center justify-center">

                <RadialIntro orbitItems={ITEMS} stageSize={500} imageSize={80} />

                </div>
            </div>
        </section>
    )
}

const ITEMS = [
    {
        id: 1,
        name: 'Node.js',
        src: 'https://stickersdevs.com.br/wp-content/uploads/2020/06/node_n_sticker_adesivo.jpg'
    },
    {
        id: 2,
        name: 'React',
        src: 'https://images.icon-icons.com/2108/PNG/512/react_icon_130845.png'
    },
    {
        id: 3,
        name: 'Next.js',
        src: 'https://marcbruederlin.gallerycdn.vsassets.io/extensions/marcbruederlin/next-icons/0.1.0/1723747598319/Microsoft.VisualStudio.Services.Icons.Default'
    },
    {
        id: 4,
        name: 'Nest.js',
        src: 'https://logowik.com/content/uploads/images/nestjs-node-js1721157586.logowik.com.webp'
    },
    {
        id: 7,
        name: 'MongoDB',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSITHn_TgjDyhdWvePNw0mveDrTUr00GLfv_Q&s'
    },
    {
        id: 8,
        name: 'MySQL',
        src: 'https://stickersdevs.com.br/wp-content/uploads/2015/07/mysql_sticker-adesivo-1.png'
    },
    {
        id: 13,
        name: 'Prisma',
        src: 'https://asset.brandfetch.io/idBBE3_R9e/idzL_5tH6B.jpg'
    },
    {
        id: 5,
        name: 'Tailwind CSS',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSDKn3vA2YUbXzN0ZC3gALWJ08gJN-Drl15w&s'
    },
    {
        id: 6,
        name: 'TypeScript',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/960px-Typescript_logo_2020.svg.png'
    },
    {
        id: 9,
        name: 'Docker',
        src: 'https://cdn.iconscout.com/icon/free/png-256/free-docker-logo-icon-svg-download-png-2285024.png?f=webp'
    },
    {
        id: 10,
        name: 'N8N',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8b13FupbJiqRDcYQbK4BfEcAJ6S7eA8I5oQ&s'
    },
    {
        id: 11,
        name: 'AWS',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRysX62yV0u_2qVQ1L8aX2YZPDCuto1Y1uhGw&s'
    },
    {
        id: 12,
        name: 'Evolution API',
        src: 'https://yt3.googleusercontent.com/3t3k7tXxnr8tCFM1mIQ8UVAGoqesSb2YGkciUpZC4pRIbY_9vJi-XHadYQUrQUz6t1X5nemJXg=s900-c-k-c0x00ffffff-no-rj'
    }
]