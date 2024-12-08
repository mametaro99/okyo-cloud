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

type OkyoProps = {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  articleUrl: string;
  published: boolean;
};

const OkyoForm: NextPage = () => {
  const router = useRouter();
  useRequireSignedIn();
  const [user] = useUserState();
  const [, setSnackbar] = useSnackbarState();
  const [isLoading, setIsLoading] = useState(false);
  const [okyo, setOkyo] = useState<Partial<OkyoProps>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { id } = router.query;
  const okyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/okyo/${id}`;
  const updateOkyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/okyo/${id}`;
  const { data: okyoData, error: okyoError } = useSWR(okyoUrl, fetcher);

  React.useEffect(() => {
    if (!router.isReady) return;
    if (!user.isSignedIn) return;
    if (okyoError) return;
    if (!okyoData) return;

    const loadedOkyo: OkyoProps = camelcaseKeys(okyoData.okyo);
    setOkyo(loadedOkyo);
  }, [router.isReady, user.isSignedIn, okyoError, okyoData]);

  if (!router.isReady) {
    return <Loading />;
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      const filePreview = URL.createObjectURL(uploadedFile);
      setPreviewUrl(filePreview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    const formData = new FormData();
    formData.append('okyo[name]', okyo.name || '');
    formData.append('okyo[description]', okyo.description || '');
    formData.append('okyo[article_url]', okyo.articleUrl || '');
    formData.append('okyo[published]', String(okyo.published || false));

    if (file) {
      formData.append('okyo[video]', file);
    }

    try {
      await axios.put(updateOkyoUrl, formData, { headers });
      setSnackbar({
        message: '編集を保存しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push(`/okyos/${id}`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';
  
      console.error('Submission error:', err);
      setSnackbar({
        message: `編集に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box css={styles.pageMinHeight}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        お経の編集
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="名前"
          value={okyo.name || ''}
          onChange={(e) => setOkyo({ ...okyo, name: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="説明"
          value={okyo.description || ''}
          onChange={(e) => setOkyo({ ...okyo, description: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="記事のURL"
          value={okyo.articleUrl || ''}
          onChange={(e) => setOkyo({ ...okyo, articleUrl: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">動画または音声ファイル</Typography>
          <input type="file" accept="video/mp4,audio/mp3" onChange={handleFileChange} />
          {previewUrl && (
            <Box sx={{ mt: 2 }}>
              {file?.type.startsWith('video') ? (
                <video src={previewUrl} controls width="100%" />
              ) : (
                <audio src={previewUrl} controls />
              )}
            </Box>
          )}
        </Box>

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            aria-label="published"
            name="published"
            value={okyo.published ? 'true' : 'false'}
            onChange={(e) => setOkyo({ ...okyo, published: e.target.value === 'true' })}
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
