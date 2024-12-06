import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useRequireSignedIn } from "@/hooks/useRequireSignedIn";
import { useUserState } from "@/hooks/useGlobalState";
import { fetcher } from "@/utils";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import UserOkyoCard from "@/components/UserOkyoCard";

// Define the types for data
type Okyo = {
  id: string;
  name: string;
  description: string;
  sects: { name: string }[];
};

type OkyoListResponse = {
  okyos: Okyo[];
};

const CurrentOkyos: NextPage = () => {
  const router = useRouter();
  const [user] = useUserState();

  // State to track whether the router is ready
  const [isRouterReady, setIsRouterReady] = useState(false);

  // Check if the router is ready
  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
    }
  }, [router.isReady]);

  // Require user to be signed in
  useRequireSignedIn();

  // URLs for fetching data
  const okyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/okyo`;
  const userUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/user`;

  // Fetch data using SWR
  const { data: okyoData, error: okyoError } = useSWR<OkyoListResponse>(isRouterReady ? okyoUrl : null, fetcher);
  const { data: currentUser, error: userError } = useSWR(isRouterReady ? userUrl : null, fetcher);

  // Handle loading and error states
  if (!user?.isSignedIn) return <Error />;
  if (okyoError || userError) return <Error />;
  if (!okyoData || !currentUser) return <Loading />;

  const userSectName = currentUser.sect?.name;
  const okyos = okyoData || [];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', padding: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          所属している宗派のみ、編集可能です。
        </Typography>
        <Grid container spacing={3}>
          {okyos.map((okyo) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={okyo.id}>
              <UserOkyoCard
                id={okyo.id}
                name={okyo.name}
                description={okyo.description}
                sects={okyo.sects}
                userSectName={userSectName}
              />
            </Grid>
          ))}
        </Grid>

        {/* Create New Okyo Link */}
        <Box sx={{ marginTop: 4, textAlign: "center" }}>
          <Button
            component={Link}
            href="/user/okyos/new"
            variant="contained"
            color="primary"
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: 16,
              borderRadius: 2,
              width: 180,
              boxShadow: 'none',
            }}
          >
            新しいお経を作成
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CurrentOkyos;
