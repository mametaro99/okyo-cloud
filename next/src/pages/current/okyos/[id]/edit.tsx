import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useSWR from 'swr';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState';
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn';
import { styles } from '@/styles';
import { fetcher } from '@/utils';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

type OkyoProps = {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  articleUrl: string;
  published: boolean;
  sects: { id: number; name: string }[];
};

const OkyoForm: NextPage = () => {
  const router = useRouter();
  useRequireSignedIn();
  const [user] = useUserState();
  const [, setSnackbar] = useSnackbarState();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [okyo, setOkyo] = useState<Partial<OkyoProps>>({});

  const { id } = router.query;
  const okyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/okyo/${id}`;
  const updateOkyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/okyo/${id}`;

  const { data: okyoData, error: okyoError } = useSWR(okyoUrl, fetcher);

  React.useEffect(() => {
    if (!router.isReady) return;
    if (!user.isSignedIn) return;
    if (okyoError) return;
    if (!okyoData) return;

    const loadedOkyo: OkyoProps = camelcaseKeys(okyoData);
    setOkyo(loadedOkyo);
  }, [router.isReady, user.isSignedIn, okyoError, okyoData]);

  if (!router.isReady) {
    return <Loading />;
  }

  if (!user.isSignedIn) {
    return <Error />;
  }

  if (okyoError) return <Error />;
  if (!okyoData) return <Loading />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const headers = {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    const payload = {
      okyo: {
        name: okyo.name,
        description: okyo.description,
        article_url: okyo.articleUrl,
        video_url: okyo.videoUrl,
        published: okyo.published,
        sect_ids: okyo.sects?.map((sect) => sect.id) || [],
      },
    };

    try {
      await axios.put(updateOkyoUrl, payload, { headers });

      setSnackbar({
        message: '編集を保存しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push(`/okyo/${id}`);
    } catch (err) {
      const error = err as AxiosError;
      console.error('Submission error:', error.message);
      setSnackbar({
        message: '編集に失敗しました',
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        borderTop: '0.5px solid #acbcc7',
        pb: 8,
        px: 2,
        pt: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        お経の編集
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="名前"
          value={okyoData.okyo.name || ''}
          onChange={(e) => setOkyo({ ...okyo, name: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="説明"
          value={okyoData.okyo.description || ''}
          onChange={(e) => setOkyo({ ...okyo, description: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="記事のURL"
          value={okyoData.okyo.article_url || ''}
          onChange={(e) => setOkyo({ ...okyo, articleUrl: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="ビデオのURL"
          value={okyoData.okyo.video_url || ''}
          onChange={(e) => setOkyo({ ...okyo, videoUrl: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            aria-label="published"
            name="published"
            value={okyoData.okyo.published ? 'true' : 'false'}
            onChange={(e) => {
              const value = e.target.value === 'true';
              setOkyo({ ...okyo, published: value });
            }}
          >
            <FormControlLabel value="true" control={<Radio />} label="公開" />
            <FormControlLabel value="false" control={<Radio />} label="非公開" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <LoadingButton
            type="submit"
            loading={isLoading}
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
          >
            保存
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default OkyoForm;
