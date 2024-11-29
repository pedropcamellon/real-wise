import { Box, Container, Typography, Button } from '@mui/material'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Search as SearchIcon } from '@mui/icons-material'
import Link from 'next/link'
import PagesOverview from '@/components/PagesOverview'
import UserSession from '@/components/UserSession'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight text-gray-900">
        RealWise - A real estate management system
      </h1>

      <UserSession />

      <hr className="my-8" />

      <PagesOverview />

      <hr className="my-8" />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '600px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundImage: 'url(/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Find Your Perfect Property
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Discover a wide range of properties tailored to your needs
          </Typography>
          {session ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              href="/properties"
              component={Link}
              sx={{
                backgroundColor: '#1277e1',
                '&:hover': {
                  backgroundColor: '#0e5bb8',
                },
              }}
            >
              Browse Properties
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              href="/api/auth/signin"
              component={Link}
              sx={{
                backgroundColor: '#1277e1',
                '&:hover': {
                  backgroundColor: '#0e5bb8',
                },
              }}
            >
              Get Started
            </Button>
          )}
        </Container>
      </Box>
    </>
  )
}
