import React from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { fetcher } from "@/utils";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import camelcaseKeys from "camelcase-keys";
import { useRequireSignedIn } from "@/hooks/useRequireSignedIn";

interface Ceremony {
  id: string;
  name: string;
  location: string;
  description: string;
  userId: number;
  eventDate: string;
}

const CeremonyList: NextPage = () => {
  const router = useRouter();
  useRequireSignedIn();

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/ceremony`;
  const { data: ceremonies, error } = useSWR<Ceremony[]>(url, fetcher);

  if (error) return <Error />;
  if (!ceremonies) return <Loading />;

  // camelcaseKeys で全ての式典データを変換
  const ceremonyList = ceremonies.map((ceremony) => camelcaseKeys({ ...ceremony }));

  return (
    <Container sx={{ maxWidth: "800px", mx: "auto", p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        式典一覧
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            color: 'white',
            textTransform: 'none',
            fontSize: 16,
            borderRadius: 2,
            width: 100,
            boxShadow: 'none',
          }}
          onClick={() => router.push("/current/ceremony/new")}
        >
          新規作成
        </Button>
      </Box>

      <List>
        {ceremonyList.map((ceremony) => (
          <ListItem
            key={ceremony.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              mb: 2,
              p: 2,
            }}
          >
            <ListItemText
              primary={ceremony.name}
              secondary={ceremony.location}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="info"
                onClick={() => router.push(`/current/ceremony/${ceremony.id}/show`)}
              >
                詳細
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push(`/current/ceremony/${ceremony.id}/edit`)}
              >
                編集
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CeremonyList;