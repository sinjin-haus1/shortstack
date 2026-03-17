'use client';

import { useState, useCallback } from 'react';
import { 
  Container, Typography, Box, Paper, Button, LinearProgress,
  Card, CardContent, CardMedia, Grid, Chip, TextField, IconButton,
  Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress
} from '@mui/material';
import { 
  CloudUpload, Movie, ContentCut, Subtitles, AspectRatio,
  Download, Delete, PlayArrow, Refresh
} from '@mui/icons-material';

interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  hook: string;
  caption: string;
  aspectRatio: string;
}

interface Video {
  id: string;
  filename: string;
  status: string;
  clips: VideoClip[];
}

export default function ShortStack() {
  const [video, setVideo] = useState<Video | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Feature 1: Video Upload (drag & drop)
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVideo({
      id: 'video-' + Date.now(),
      filename: file.name,
      status: 'uploaded',
      clips: []
    });
    setUploading(false);
  };

  // Feature 2: AI Clip Generation with hooks
  const generateClips = async () => {
    if (!video) return;
    setProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const hooks = [
      'Wait until you see this...',
      'You won\'t believe what happens next!',
      'This changed everything for me.',
      'Here\'s the secret no one tells you...',
      'The results speak for themselves.',
    ];
    
    const newClips: VideoClip[] = hooks.map((hook, i) => ({
      id: `clip-${i}`,
      startTime: i * 15,
      endTime: (i * 15) + 30,
      hook,
      caption: '',
      aspectRatio: '9:16'
    }));
    
    setVideo({ ...video, clips: newClips, status: 'clips-generated' });
    setProcessing(false);
  };

  // Feature 3: Caption Generation
  const generateCaptions = async () => {
    if (!video) return;
    setProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedClips = video.clips.map(clip => ({
      ...clip,
      caption: `${clip.hook} This is an AI-generated caption for this clip.`
    }));
    
    setVideo({ ...video, clips: updatedClips, status: 'captions-generated' });
    setProcessing(false);
  };

  // Feature 4: Aspect Ratio Conversion
  const convertAspectRatio = async (clipId: string, aspectRatio: string) => {
    if (!video) return;
    
    const updatedClips = video.clips.map(clip => 
      clip.id === clipId ? { ...clip, aspectRatio } : clip
    );
    
    setVideo({ ...video, clips: updatedClips });
  };

  // Feature 5: Bulk Export
  const exportClips = () => {
    if (!video) return;
    alert(`Exporting ${video.clips.length} clips as ZIP...`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', color: '#fff' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            ShortStack
          </Typography>
          <Typography variant="h6" sx={{ color: '#888' }}>
            AI Short Video Repurposer - Turn one video into 10+ platform-optimized clips
          </Typography>
        </Box>

        {/* Feature 1: Video Upload */}
        <Paper 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{ 
            p: 6, 
            mb: 4, 
            bgcolor: dragActive ? '#1a1a2e' : '#111',
            border: '2px dashed',
            borderColor: dragActive ? '#6c5ce7' : '#333',
            borderRadius: 2,
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <CloudUpload sx={{ fontSize: 64, color: '#6c5ce7', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            {uploading ? 'Uploading...' : 'Drag & drop your video here'}
          </Typography>
          <Typography sx={{ color: '#666', mb: 3 }}>
            or click to browse files
          </Typography>
          <Button 
            variant="contained" 
            component="label"
            sx={{ bgcolor: '#6c5ce7', '&:hover': { bgcolor: '#5b4cdb' } }}
          >
            Select Video
            <input 
              type="file" 
              accept="video/*" 
              hidden 
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </Button>
          {uploading && <LinearProgress sx={{ mt: 3 }} />}
        </Paper>

        {video && (
          <>
            {/* Video Info */}
            <Alert severity="success" sx={{ mb: 4, bgcolor: '#1a3a1a', color: '#4caf50' }}>
              ✅ Video uploaded: {video.filename}
            </Alert>

            {/* Feature 2: AI Clip Generation */}
            <Paper sx={{ p: 4, mb: 4, bgcolor: '#111' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ContentCut sx={{ color: '#00d9ff', mr: 2 }} />
                <Typography variant="h5">AI Clip Generation</Typography>
              </Box>
              
              {video.clips.length === 0 ? (
                <Button 
                  variant="contained" 
                  startIcon={<Movie />}
                  onClick={generateClips}
                  disabled={processing}
                  sx={{ bgcolor: '#00d9ff', color: '#000', '&:hover': { bgcolor: '#00b8d9' } }}
                >
                  {processing ? 'Generating...' : 'Generate AI Clips'}
                </Button>
              ) : (
                <Typography sx={{ color: '#4caf50' }}>
                  ✅ Generated {video.clips.length} clips with hooks
                </Typography>
              )}
            </Paper>

            {/* Feature 3: Caption Generation */}
            <Paper sx={{ p: 4, mb: 4, bgcolor: '#111' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Subtitles sx={{ color: '#ff6b6b', mr: 2 }} />
                <Typography variant="h5">Caption Generation</Typography>
              </Box>
              
              {video.clips.length > 0 && video.clips[0].caption === '' ? (
                <Button 
                  variant="contained" 
                  startIcon={<Subtitles />}
                  onClick={generateCaptions}
                  disabled={processing}
                  sx={{ bgcolor: '#ff6b6b', '&:hover': { bgcolor: '#e55555' } }}
                >
                  {processing ? 'Generating...' : 'Generate AI Captions'}
                </Button>
              ) : (
                <Typography sx={{ color: '#4caf50' }}>
                  ✅ Captions generated for all clips
                </Typography>
              )}
            </Paper>

            {/* Feature 4 & 5: Clips with Aspect Ratio & Export */}
            {video.clips.length > 0 && (
              <Paper sx={{ p: 4, mb: 4, bgcolor: '#111' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AspectRatio sx={{ color: '#ffd93d', mr: 2 }} />
                    <Typography variant="h5">Your Clips</Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    startIcon={<Download />}
                    onClick={exportClips}
                    sx={{ bgcolor: '#ffd93d', color: '#000', '&:hover': { bgcolor: '#e6c235' } }}
                  >
                    Bulk Export (ZIP)
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {video.clips.map((clip, index) => (
                    <Grid item xs={12} md={6} key={clip.id}>
                      <Card sx={{ bgcolor: '#1a1a1a' }}>
                        <Box sx={{ 
                          aspectRatio: '16/9', 
                          bgcolor: '#222', 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <PlayArrow sx={{ fontSize: 48, color: '#666' }} />
                          <Chip 
                            label={clip.aspectRatio} 
                            size="small" 
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#333' }}
                          />
                        </Box>
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ color: '#ff6b6b', fontWeight: 600 }}>
                            Hook: {clip.hook}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                            {clip.startTime}s - {clip.endTime}s
                          </Typography>
                          {clip.caption && (
                            <Typography variant="body2" sx={{ color: '#aaa', mt: 2, fontStyle: 'italic' }}>
                              &quot;{clip.caption}&quot;
                            </Typography>
                          )}
                          
                          {/* Feature 4: Aspect Ratio Conversion */}
                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel sx={{ color: '#888' }}>Aspect Ratio</InputLabel>
                            <Select
                              value={clip.aspectRatio}
                              label="Aspect Ratio"
                              onChange={(e) => convertAspectRatio(clip.id, e.target.value)}
                              sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
                            >
                              <MenuItem value="9:16">9:16 (TikTok, Reels, Shorts)</MenuItem>
                              <MenuItem value="16:9">16:9 (YouTube)</MenuItem>
                              <MenuItem value="1:1">1:1 (Instagram Feed)</MenuItem>
                            </Select>
                          </FormControl>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
