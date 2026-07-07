import React, { useState, useRef, useEffect } from 'react';
import { DamagePin } from '../types';
import { MOCK_INITIAL_PINS } from '../mockData';
import { 
  Map, 
  Pin, 
  Trash2, 
  Sliders, 
  Info, 
  Weight, 
  Wind, 
  HelpCircle, 
  Pencil, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Upload, 
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Eraser,
  AlertTriangle,
  Video,
  Volume2,
  FileVideo,
  VideoOff,
  Camera
} from 'lucide-react';

interface DamageCanvasProps {
  pins: DamagePin[];
  onPinsChange: (updatedPins: DamagePin[]) => void;
}

export default function DamageCanvas({ pins, onPinsChange }: DamageCanvasProps) {
  const [selectedPin, setSelectedPin] = useState<DamagePin | null>(pins[0] || null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState<{ x: number; y: number } | null>(null);

  // New Pin form states
  const [newDamageType, setNewDamageType] = useState<DamagePin['damageType']>('Hail Bruising');
  const [newNotes, setNewNotes] = useState('');
  const [newSeverity, setNewSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showCategoryHelp, setShowCategoryHelp] = useState(false);

  // Video Evidence Upload States
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [videoNarration, setVideoNarration] = useState('');
  const [videoSizeError, setVideoSizeError] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [evidenceType, setEvidenceType] = useState<'photos' | 'video'>('photos');

  // Selected Pin Edit States
  const [isEditingSelectedPin, setIsEditingSelectedPin] = useState(false);
  const [editDamageType, setEditDamageType] = useState<DamagePin['damageType']>('Hail Bruising');
  const [editNotes, setEditNotes] = useState('');
  const [editSeverity, setEditSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  // Drawing markup states
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#f59e0b'); // Amber
  const [canvasImage, setCanvasImage] = useState<string>('https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop');
  const markupCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [lineWidth, setLineWidth] = useState(6);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pinToDeleteId, setPinToDeleteId] = useState<string | null>(null);

  // States for Site Photo Zoom & Pan (Grab & Move)
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPan, setPhotoPan] = useState({ x: 0, y: 0 });
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [dragPhotoStart, setDragPhotoStart] = useState({ x: 0, y: 0 });

  // Reset zoom & pan when the active image changes
  useEffect(() => {
    setPhotoZoom(1);
    setPhotoPan({ x: 0, y: 0 });
  }, [canvasImage]);

  const handlePhotoMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (photoZoom <= 1) return;
    e.preventDefault();
    setIsDraggingPhoto(true);
    setDragPhotoStart({ x: e.clientX - photoPan.x, y: e.clientY - photoPan.y });
  };

  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDraggingPhoto || photoZoom <= 1) return;
    e.preventDefault();
    setPhotoPan({
      x: e.clientX - dragPhotoStart.x,
      y: e.clientY - dragPhotoStart.y
    });
  };

  const handlePhotoMouseUp = () => {
    setIsDraggingPhoto(false);
  };

  const handlePhotoMouseLeave = () => {
    setIsDraggingPhoto(false);
  };

  // Roof drawing markup states
  const [isDrawingOnRoof, setIsDrawingOnRoof] = useState(false);
  const [roofMarkupImage, setRoofMarkupImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('roof_markup_image') || null;
    } catch {
      return null;
    }
  });
  const roofMarkupCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [roofIsDrawing, setRoofIsDrawing] = useState(false);
  const [roofIsEraser, setRoofIsEraser] = useState(false);
  const [roofDrawingColor, setRoofDrawingColor] = useState('#ef4444'); // Red default for roof markup to pop out nicely!
  const [roofLineWidth, setRoofLineWidth] = useState(6);

  // Material Calculator States
  const [materialTier, setMaterialTier] = useState<'3tab' | 'architectural' | 'metal' | 'slate' | 'wood' | 'clay'>('architectural');
  const [wasteFactor, setWasteFactor] = useState<number>(10); // 10% standard
  const [hoveredTier, setHoveredTier] = useState<'3tab' | 'architectural' | 'metal' | 'slate' | 'wood' | 'clay' | null>(null);

  // Roof metrics (Fixed based on Imlay City local assessment example)
  const baseSquares = 32; // 3,200 sq ft

  // Handle click on top-down roof image to place new pin
  const handleRoofClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setNewPinCoords({ x, y });
  };

  const handleVideoFile = (file: File) => {
    setVideoSizeError(null);
    const MAX_SIZE_MB = 50;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    
    if (file.size > MAX_SIZE_BYTES) {
      setVideoSizeError(`Video size of ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds the limit of ${MAX_SIZE_MB}MB. Please trim or compress the video.`);
      return;
    }

    setIsUploadingVideo(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      setUploadedVideo(objectUrl);
      setIsUploadingVideo(false);
    } catch {
      setVideoSizeError("Failed to process the video file. Please try a different format.");
      setIsUploadingVideo(false);
    }
  };

  const handleSavePin = () => {
    if (!newPinCoords) return;

    const defaultImage = 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop';
    const finalPhotos = uploadedPreviews.length > 0 ? uploadedPreviews : [defaultImage];
    const initialPhotoNotes = Array(finalPhotos.length).fill('');
    initialPhotoNotes[0] = newNotes || 'No notes provided.';

    const newPin: DamagePin = {
      id: `pin-${Date.now()}`,
      facetName: 'Roof Section',
      x: newPinCoords.x,
      y: newPinCoords.y,
      damageType: newDamageType,
      notes: newNotes || 'No notes provided.',
      severity: newSeverity,
      photoUrl: finalPhotos[0],
      photoUrls: finalPhotos,
      photoNotes: initialPhotoNotes,
      videoUrl: uploadedVideo || undefined,
      videoNarration: videoNarration || undefined
    };

    const updated = [...pins, newPin];
    onPinsChange(updated);
    setSelectedPin(newPin);

    // Reset States
    setIsAddingPin(false);
    setNewPinCoords(null);
    setNewNotes('');
    setUploadedPreviews([]);
    setUploadedVideo(null);
    setVideoNarration('');
    setVideoSizeError(null);
    setIsUploadingVideo(false);
    setEvidenceType('photos');
  };

  const handleDeletePin = (pinId: string) => {
    setPinToDeleteId(pinId);
  };

  const handleConfirmDeletePin = () => {
    if (!pinToDeleteId) return;
    const updated = pins.filter(p => p.id !== pinToDeleteId);
    onPinsChange(updated);
    if (selectedPin?.id === pinToDeleteId) {
      setSelectedPin(updated[0] || null);
    }
    setPinToDeleteId(null);
  };

  const handleUpdatePin = () => {
    if (!selectedPin) return;

    const updatedPin: DamagePin = {
      ...selectedPin,
      damageType: editDamageType,
      severity: editSeverity,
      notes: editNotes,
    };

    if (updatedPin.photoNotes) {
      const updatedPhotoNotes = [...updatedPin.photoNotes];
      if (updatedPhotoNotes.length > 0) {
        updatedPhotoNotes[0] = editNotes;
      } else {
        updatedPhotoNotes.push(editNotes);
      }
      updatedPin.photoNotes = updatedPhotoNotes;
    } else {
      updatedPin.photoNotes = [editNotes];
    }

    setSelectedPin(updatedPin);

    const updatedPins = pins.map(p => {
      if (p.id === selectedPin.id) {
        return updatedPin;
      }
      return p;
    });
    onPinsChange(updatedPins);
    setIsEditingSelectedPin(false);
  };

  const handleSelectedPinVideoFile = (file: File) => {
    if (!selectedPin) return;
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setVideoSizeError(`Video size of ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds the limit of ${MAX_SIZE_MB}MB. Please trim or compress the video.`);
      return;
    }

    setIsUploadingVideo(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      const totalPhotosCount = selectedPin.photoUrls?.length || 1;
      
      const currentVideoUrls = selectedPin.videoUrls && selectedPin.videoUrls.length > 0
        ? [...selectedPin.videoUrls]
        : Array(totalPhotosCount).fill(undefined);
      
      while (currentVideoUrls.length < totalPhotosCount) {
        currentVideoUrls.push(undefined);
      }
      
      currentVideoUrls[activePhotoIndex] = objectUrl;

      const updatedPin: DamagePin = {
        ...selectedPin,
        videoUrl: activePhotoIndex === 0 ? objectUrl : (selectedPin.videoUrl || currentVideoUrls[0]),
        videoUrls: currentVideoUrls
      };
      
      setSelectedPin(updatedPin);
      const updatedPins = pins.map(p => p.id === selectedPin.id ? updatedPin : p);
      onPinsChange(updatedPins);
      setIsUploadingVideo(false);
      setVideoSizeError(null);
    } catch {
      setVideoSizeError("Failed to process the video file. Please try a different format.");
      setIsUploadingVideo(false);
    }
  };

  const handleRemoveSelectedPinVideo = () => {
    if (!selectedPin) return;
    const totalPhotosCount = selectedPin.photoUrls?.length || 1;
    
    const currentVideoUrls = selectedPin.videoUrls && selectedPin.videoUrls.length > 0
      ? [...selectedPin.videoUrls]
      : Array(totalPhotosCount).fill(undefined);
      
    while (currentVideoUrls.length < totalPhotosCount) {
      currentVideoUrls.push(undefined);
    }
    
    currentVideoUrls[activePhotoIndex] = undefined;

    const currentNarrations = selectedPin.videoNarrations && selectedPin.videoNarrations.length > 0
      ? [...selectedPin.videoNarrations]
      : Array(totalPhotosCount).fill(undefined);
      
    while (currentNarrations.length < totalPhotosCount) {
      currentNarrations.push(undefined);
    }
    
    currentNarrations[activePhotoIndex] = undefined;

    const updatedPin: DamagePin = {
      ...selectedPin,
      videoUrl: activePhotoIndex === 0 ? undefined : selectedPin.videoUrl,
      videoNarration: activePhotoIndex === 0 ? undefined : selectedPin.videoNarration,
      videoUrls: currentVideoUrls,
      videoNarrations: currentNarrations
    };
    setSelectedPin(updatedPin);
    const updatedPins = pins.map(p => p.id === selectedPin.id ? updatedPin : p);
    onPinsChange(updatedPins);
  };

  const handleRemoveSelectedPinPhoto = (idxToRemove: number) => {
    if (!selectedPin) return;

    const currentUrls = selectedPin.photoUrls && selectedPin.photoUrls.length > 0
      ? [...selectedPin.photoUrls]
      : [selectedPin.photoUrl || 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop'];
    
    const currentNotes = selectedPin.photoNotes && selectedPin.photoNotes.length > 0
      ? [...selectedPin.photoNotes]
      : [selectedPin.notes || 'No notes provided.'];

    // Filter out the selected photo and its matching note
    const updatedUrls = currentUrls.filter((_, idx) => idx !== idxToRemove);
    const updatedNotes = currentNotes.filter((_, idx) => idx !== idxToRemove);

    const defaultImage = 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop';
    const finalUrls = updatedUrls.length > 0 ? updatedUrls : [defaultImage];
    const finalNotes = updatedNotes.length > 0 ? updatedNotes : ['No notes provided.'];

    const newPrimaryUrl = finalUrls[0];

    const currentVideoUrls = selectedPin.videoUrls && selectedPin.videoUrls.length > 0
      ? [...selectedPin.videoUrls]
      : Array(currentUrls.length).fill(undefined);
    while (currentVideoUrls.length < currentUrls.length) {
      currentVideoUrls.push(undefined);
    }

    const currentNarrations = selectedPin.videoNarrations && selectedPin.videoNarrations.length > 0
      ? [...selectedPin.videoNarrations]
      : Array(currentUrls.length).fill(undefined);
    while (currentNarrations.length < currentUrls.length) {
      currentNarrations.push(undefined);
    }

    const updatedVideoUrls = currentVideoUrls.filter((_, idx) => idx !== idxToRemove);
    const updatedNarrations = currentNarrations.filter((_, idx) => idx !== idxToRemove);

    const updatedPin: DamagePin = {
      ...selectedPin,
      photoUrl: newPrimaryUrl,
      photoUrls: finalUrls,
      photoNotes: finalNotes,
      videoUrl: updatedVideoUrls[0],
      videoNarration: updatedNarrations[0],
      videoUrls: updatedVideoUrls,
      videoNarrations: updatedNarrations
    };

    // Correctly reposition activePhotoIndex
    let nextIndex = activePhotoIndex;
    if (idxToRemove === activePhotoIndex) {
      nextIndex = 0;
    } else if (idxToRemove < activePhotoIndex) {
      nextIndex = activePhotoIndex - 1;
    }

    if (nextIndex >= finalUrls.length) {
      nextIndex = Math.max(0, finalUrls.length - 1);
    }

    setActivePhotoIndex(nextIndex);
    setCanvasImage(finalUrls[nextIndex]);
    setSelectedPin(updatedPin);

    const updatedPins = pins.map(p => p.id === selectedPin.id ? updatedPin : p);
    onPinsChange(updatedPins);
  };

  // Canvas markup engine
  useEffect(() => {
    if (!selectedPin) return;
    setActivePhotoIndex(0);
    const initialPhoto = selectedPin.photoUrls?.[0] || selectedPin.photoUrl || 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop';
    setCanvasImage(initialPhoto);
    setIsEditingSelectedPin(false);
    setEditDamageType(selectedPin.damageType);
    setEditNotes(selectedPin.notes);
    setEditSeverity(selectedPin.severity);
  }, [selectedPin?.id]);

  useEffect(() => {
    if (!isDrawingMode || !markupCanvasRef.current) return;
    const canvas = markupCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transparent canvas drawing overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEraser(false);
    setZoomLevel(1);
  }, [isDrawingMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = markupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = markupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveMarkup = () => {
    const canvas = markupCanvasRef.current;
    if (!canvas) return;

    // Create offscreen canvas to merge original image and transparent overlay
    const mergeCanvas = document.createElement('canvas');
    mergeCanvas.width = canvas.width;
    mergeCanvas.height = canvas.height;
    const mergeCtx = mergeCanvas.getContext('2d');
    if (!mergeCtx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = canvasImage;
    img.onload = () => {
      // 1. Draw original photo
      mergeCtx.drawImage(img, 0, 0, mergeCanvas.width, mergeCanvas.height);
      // 2. Draw our drawing overlay on top
      mergeCtx.drawImage(canvas, 0, 0, mergeCanvas.width, mergeCanvas.height);
      
      const dataUrl = mergeCanvas.toDataURL('image/png');
      setCanvasImage(dataUrl);
      setIsDrawingMode(false);
      setZoomLevel(1);

      if (selectedPin) {
        const currentPhotos = selectedPin.photoUrls && selectedPin.photoUrls.length > 0
          ? [...selectedPin.photoUrls]
          : [selectedPin.photoUrl || canvasImage];
        
        currentPhotos[activePhotoIndex] = dataUrl;

        const updatedPins = pins.map(p => {
          if (p.id === selectedPin.id) {
            return { 
              ...p, 
              photoUrl: currentPhotos[0],
              photoUrls: currentPhotos
            };
          }
          return p;
        });
        onPinsChange(updatedPins);
        setSelectedPin({ 
          ...selectedPin, 
          photoUrl: currentPhotos[0],
          photoUrls: currentPhotos 
        });
      }
    };
  };

  const resetMarkup = () => {
    const canvas = markupCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Roof Canvas markup engine
  useEffect(() => {
    if (!isDrawingOnRoof || !roofMarkupCanvasRef.current) return;
    const canvas = roofMarkupCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get the persisted markup image at the moment we open the drawing mode
    const persistedImage = localStorage.getItem('roof_markup_image');
    if (persistedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = persistedImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [isDrawingOnRoof]);

  const startRoofDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = roofMarkupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (roofIsEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = roofLineWidth * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = roofDrawingColor;
      ctx.lineWidth = roofLineWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setRoofIsDrawing(true);
  };

  const drawRoof = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!roofIsDrawing) return;
    const canvas = roofMarkupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const startRoofDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = roofMarkupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (roofIsEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = roofLineWidth * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = roofDrawingColor;
      ctx.lineWidth = roofLineWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setRoofIsDrawing(true);
  };

  const drawRoofTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!roofIsDrawing) return;
    const canvas = roofMarkupCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopRoofDrawing = () => {
    setRoofIsDrawing(false);
  };

  const saveRoofMarkup = () => {
    const canvas = roofMarkupCanvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setRoofMarkupImage(dataUrl);
    try {
      localStorage.setItem('roof_markup_image', dataUrl);
    } catch (err) {
      console.warn('Failed to save roof markup to localStorage', err);
    }
    setIsDrawingOnRoof(false);
  };

  const cancelRoofMarkup = () => {
    setIsDrawingOnRoof(false);
  };

  const clearRoofMarkup = () => {
    const canvas = roofMarkupCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const resetRoofDrawingEntirely = () => {
    if (window.confirm("Are you sure you want to delete all drawings on the roof schematic?")) {
      setRoofMarkupImage(null);
      try {
        localStorage.removeItem('roof_markup_image');
      } catch {}
      const canvas = roofMarkupCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  // Dynamic Math
  const totalSquaresNeeded = Number((baseSquares * (1 + wasteFactor / 100)).toFixed(1));
  const materialDetails = {
    '3tab': {
      name: 'Standard 3-Tab Shingles',
      weightPerSquare: 220, // lbs
      windRating: '60 MPH',
      aesthetic: 'Flat, traditional design. Shorter lifespan (15-20 yrs).',
      priceFactor: 0.85,
      notes: 'Michigan ice-and-water rules are especially critical here to prevent ridge lift and thermal tearing.'
    },
    'architectural': {
      name: 'Premium Architectural (Laminate)',
      weightPerSquare: 240, // lbs
      windRating: '110-130 MPH',
      aesthetic: 'Thicker dimensional slate look. Longer lifespan (30-50 yrs). Highly recommended for heavy snow.',
      priceFactor: 1.0,
      notes: 'Preferred by major insurers for Replacement Cost Value (RCV) settlements.'
    },
    'metal': {
      name: 'Seamless Standing Seam Metal',
      weightPerSquare: 100, // lbs
      windRating: '140+ MPH',
      aesthetic: 'Sleek, modern metal. Lifetime resilience (50+ yrs). Lightest load, sheds ice instantly.',
      priceFactor: 1.8,
      notes: 'Requires highly certified specialists. Check zoning guidelines in historic areas.'
    },
    'slate': {
      name: 'Natural Welsh Slate Tiles',
      weightPerSquare: 800, // lbs
      windRating: '150+ MPH',
      aesthetic: 'Unrivaled prestige, extreme durability (100+ yrs). Heavy load, requires structural vetting.',
      priceFactor: 3.2,
      notes: 'Extraordinarily heavy. Must consult with a structural engineer to confirm framing load capability.'
    },
    'wood': {
      name: 'Premium Western Red Cedar Shakes',
      weightPerSquare: 200, // lbs
      windRating: '120 MPH',
      aesthetic: 'Rustic, natural texture. Excellent natural insulation. Requires routine oil treatments.',
      priceFactor: 1.9,
      notes: 'Beautiful organic look. Make sure to check local fire codes for class ratings before installing.'
    },
    'clay': {
      name: 'Mediterranean Spanish Clay Tiles',
      weightPerSquare: 700, // lbs
      windRating: '130+ MPH',
      aesthetic: 'Iconic barrel shape, permanent non-fading colors (80+ yrs). Highly energy efficient.',
      priceFactor: 2.5,
      notes: 'Requires specialized tile roofing contractors. Excellent heat deflection for sunny climates.'
    }
  }[materialTier];

  const estimatedTotalWeightLbs = Math.round(totalSquaresNeeded * materialDetails.weightPerSquare);
  const estimatedCostRange = Math.round(totalSquaresNeeded * 425 * materialDetails.priceFactor);

  const materialImages = {
    '3tab': 'https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?q=80&w=400&auto=format&fit=crop',
    'architectural': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop',
    'metal': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400&auto=format&fit=crop',
    'slate': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=400&auto=format&fit=crop',
    'wood': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop',
    'clay': 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=400&auto=format&fit=crop'
  };

  const costBreakdown = {
    materials: {
      name: 'Premium Materials Supply',
      desc: `Raw ${materialDetails.name} shingles, starter strips & ridges`,
      low: Math.round(totalSquaresNeeded * 190 * materialDetails.priceFactor),
      high: Math.round(totalSquaresNeeded * 210 * materialDetails.priceFactor)
    },
    labor: {
      name: 'Cert. Professional Labor',
      desc: 'Certified local roofing crew, safety gear & cleanup',
      low: Math.round(totalSquaresNeeded * 150 * (materialDetails.priceFactor > 1.5 ? materialDetails.priceFactor * 0.95 : materialDetails.priceFactor)),
      high: Math.round(totalSquaresNeeded * 180 * (materialDetails.priceFactor > 1.5 ? materialDetails.priceFactor * 0.95 : materialDetails.priceFactor))
    },
    tearOff: {
      name: 'Tear-off & Disposal',
      desc: 'Removing & recycling existing shingle layers safely',
      low: Math.round(totalSquaresNeeded * 50),
      high: Math.round(totalSquaresNeeded * 65)
    },
    underlayment: {
      name: 'Underlay & Ice Barrier',
      desc: 'Synthetic felt, ice/water shields & drip edge metal',
      low: Math.round(totalSquaresNeeded * 25),
      high: Math.round(totalSquaresNeeded * 35)
    },
    permits: {
      name: 'Local Permits & Admin',
      desc: 'Municipal filing fees & standard code inspection',
      low: 350,
      high: 450
    }
  };

  const calculatedTotalLow = costBreakdown.materials.low + costBreakdown.labor.low + costBreakdown.tearOff.low + costBreakdown.underlayment.low + costBreakdown.permits.low;
  const calculatedTotalHigh = costBreakdown.materials.high + costBreakdown.labor.high + costBreakdown.tearOff.high + costBreakdown.underlayment.high + costBreakdown.permits.high;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="damage-canvas-viewport">
      {/* Delete Pin Confirmation Popup Modal */}
      {pinToDeleteId && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn" id="delete-pin-confirm-modal">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy">
                  Are you sure you want to delete?
                </h3>
                <p className="text-[11px] text-stone-gray font-medium">
                  This action is permanent and will remove this damage pin and its associated media evidence.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPinToDeleteId(null)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition duration-200 shadow-md hover:shadow-lg active:translate-y-px"
                id="confirm-delete-no-btn"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePin}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition duration-200 shadow-md hover:shadow-lg active:translate-y-px"
                id="confirm-delete-yes-btn"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL: The Interactive Visual Canvas (8 columns on large screens) */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-start gap-4">
        <div>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div>
              <h2 className="font-display font-bold text-navy text-xl flex items-center gap-2">
                <Map className="w-5 h-5 text-teal" />
                Homeowner Damage Interactive Canvas
              </h2>
              <p className="text-stone-gray text-xs">
                Use the "Drop New Pin" button, then tap anywhere on your custom 2D satellite roof schematic to mark damage or areas of concern.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAddingPin(!isAddingPin);
                  setNewPinCoords(null);
                  setIsDrawingOnRoof(false);
                }}
                id="toggle-add-pin-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isAddingPin
                    ? 'bg-amber text-white shadow-sm'
                    : 'bg-mist text-navy hover:bg-mist/80'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${isAddingPin ? 'animate-bounce' : ''}`} />
                {isAddingPin ? 'Cancel Pin Placement' : 'Drop New Pin'}
              </button>

              <button
                onClick={() => {
                  setIsDrawingOnRoof(!isDrawingOnRoof);
                  setIsAddingPin(false);
                  setNewPinCoords(null);
                }}
                id="toggle-draw-roof-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isDrawingOnRoof
                    ? 'bg-teal text-white shadow-sm animate-pulse'
                    : 'bg-mist text-navy hover:bg-mist/80'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                {isDrawingOnRoof ? 'Exit Drawing Mode' : 'Draw on Roof'}
              </button>

              {roofMarkupImage && (
                <button
                  onClick={resetRoofDrawingEntirely}
                  className="px-2 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition flex items-center gap-1"
                  title="Clear All Roof Markings"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Draw</span>
                </button>
              )}
            </div>
          </div>

          {/* Roof Drawing Control Bar */}
          {isDrawingOnRoof && (
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl mb-4 flex flex-wrap justify-between items-center gap-2 animate-fadeIn">
              {/* Tool Selection (Brush vs Eraser) */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700/40">
                <button
                  type="button"
                  onClick={() => setRoofIsEraser(false)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                    !roofIsEraser ? 'bg-teal text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Pen
                </button>
                <button
                  type="button"
                  onClick={() => setRoofIsEraser(true)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                    roofIsEraser ? 'bg-amber text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  Eraser
                </button>
              </div>

              {/* Brush Colors (disabled in eraser mode) */}
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/40">
                {[
                  { color: '#ef4444', name: 'Red' },
                  { color: '#f59e0b', name: 'Amber' },
                  { color: '#ec4899', name: 'Pink' },
                  { color: '#10b981', name: 'Green' },
                  { color: '#3b82f6', name: 'Blue' },
                  { color: '#8b5cf6', name: 'Purple' },
                  { color: '#eab308', name: 'Yellow' },
                  { color: '#0f172a', name: 'Slate' },
                  { color: '#ffffff', name: 'White' },
                ].map(item => (
                  <button
                    key={item.color}
                    type="button"
                    disabled={roofIsEraser}
                    onClick={() => {
                      setRoofDrawingColor(item.color);
                      setRoofIsEraser(false);
                    }}
                    className={`w-4 h-4 rounded-full border border-white/20 relative transition ${
                      roofIsEraser ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
                    } ${
                      roofDrawingColor === item.color && !roofIsEraser ? 'ring-2 ring-teal ring-offset-1 ring-offset-slate-900 scale-110' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>

              {/* Thickness Slider */}
              <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/40">
                <Sliders className="w-3.5 h-3.5 text-teal" />
                <span className="text-[10px] font-semibold text-slate-300">Thickness:</span>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={roofLineWidth}
                  onChange={(e) => setRoofLineWidth(Number(e.target.value))}
                  className="w-16 md:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal"
                />
                <span className="text-[10px] font-mono font-bold text-teal w-6 text-right">{roofLineWidth}px</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={clearRoofMarkup}
                  className="px-2.5 py-1 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 rounded-md hover:bg-slate-800 transition"
                >
                  Clear Screen
                </button>
                <button
                  type="button"
                  onClick={cancelRoofMarkup}
                  className="px-2.5 py-1 text-slate-300 hover:text-white text-[10px] font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveRoofMarkup}
                  className="px-3 py-1 bg-teal hover:bg-teal-600 text-white text-[10px] font-extrabold rounded-md shadow transition flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Save Markings
                </button>
              </div>
            </div>
          )}

          {/* Roof Visual Blueprint Representation */}
          <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900 aspect-[16/10] shadow-inner select-none cursor-crosshair">
            {/* SVG Wireframe Schematic of a Roof (Imlay Township style blueprint) */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Roof ridges and valleys */}
              <polygon points="50,15 15,50 85,50" fill="none" stroke="#4f46e5" strokeWidth="0.8" />
              <polygon points="15,50 50,85 85,50" fill="none" stroke="#4f46e5" strokeWidth="0.8" />
              <line x1="50" y1="15" x2="50" y2="85" stroke="#4f46e5" strokeWidth="1.2" strokeDasharray="2" />
              <line x1="15" y1="50" x2="85" y2="50" stroke="#6366f1" strokeWidth="0.8" />
              {/* Eave Boundaries */}
              <rect x="10" y="47" width="80" height="6" fill="none" stroke="#f59e0b" strokeWidth="0.4" strokeDasharray="3" />
            </svg>

            {/* Satellite Background Simulation Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90 flex items-center justify-center">
              <div className="text-center pointer-events-none opacity-20">
                <p className="text-[10px] font-mono tracking-widest text-mist">GOOGLE SOLAR API HYBRID MODEL</p>
                <p className="text-[8px] font-mono text-stone-gray mt-1">2026 HIGH-ALTITUDE LIDAR FLYOVER • 43.0232° N, 83.0783° W</p>
              </div>
            </div>

            {/* Click Interception Layer */}
            <div 
              className="absolute inset-0 z-10 bg-cover bg-center" 
              onClick={handleRoofClick}
              style={{ 
                backgroundImage: 'url("/mock-home.jpg"), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop")'
              }}
            >
              {/* Persisted Saved Roof Drawings Layer */}
              {roofMarkupImage && (
                <img
                  src={roofMarkupImage}
                  alt="Roof markings overlay"
                  className="absolute inset-0 w-full h-full pointer-events-none select-none z-12"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Existing Pins */}
              {pins.map(pin => (
                <button
                  key={pin.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDrawingOnRoof) return; // Prevent pin click during roof drawing
                    setSelectedPin(pin);
                    setIsAddingPin(false);
                    setNewPinCoords(null);
                  }}
                  id={`pin-selector-${pin.id}`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition duration-200 z-20 ${
                    selectedPin?.id === pin.id
                      ? 'bg-amber border-white scale-125 z-30'
                      : pin.severity === 'high'
                      ? 'bg-red-500 border-red-200 hover:scale-110'
                      : pin.severity === 'medium'
                      ? 'bg-orange-400 border-orange-100 hover:scale-110'
                      : 'bg-teal border-teal-100 hover:scale-110'
                  }`}
                >
                  <Pin className="w-4 h-4 text-white" />
                  {pin.severity === 'high' && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                  )}
                </button>
              ))}

              {/* Temporary placing pin */}
              {newPinCoords && (
                <div
                  style={{ left: `${newPinCoords.x}%`, top: `${newPinCoords.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-teal shadow-lg flex items-center justify-center animate-pulse z-20"
                >
                  <Pin className="w-4 h-4 text-teal" />
                </div>
              )}
            </div>

            {/* Active Roof Drawing Markup Overlay Canvas */}
            {isDrawingOnRoof && (
              <canvas
                ref={roofMarkupCanvasRef}
                width={1600}
                height={1000}
                onMouseDown={startRoofDrawing}
                onMouseMove={drawRoof}
                onMouseUp={stopRoofDrawing}
                onMouseLeave={stopRoofDrawing}
                onTouchStart={startRoofDrawingTouch}
                onTouchMove={drawRoofTouch}
                onTouchEnd={stopRoofDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-25 bg-transparent"
              />
            )}

            {/* Floating Blueprint legend */}
            <div className="absolute bottom-3 left-3 bg-navy/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 text-[10px] font-mono text-mist flex gap-4 pointer-events-none z-20">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Loss Exposure</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Wind/Hail Damage</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal"></span> Aging/Blisters</span>
            </div>
          </div>

          {/* New Pin creation dialog/form when a position is selected */}
          {isAddingPin && newPinCoords && (
            <div className="mt-4 p-4 bg-amber/5 border border-amber/20 rounded-xl animate-fadeIn">
              <h3 className="font-display font-semibold text-navy text-sm mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber" />
                Configure Dropped Damage Pin (X: {newPinCoords.x}%, Y: {newPinCoords.y}%)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Homeowner Safety Warning Callout */}
                <div className="bg-red-50/90 border border-red-200/60 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
                  <div className="p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 text-[11px] uppercase tracking-wider mb-0.5">
                      Homeowner Safety Alert
                    </h4>
                    <p className="text-[10px] text-red-700 leading-normal font-medium">
                      Do not climb on any ladders or step onto the roof under any circumstances. Please stay safe and take all physical photo evidence from the ground.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase mb-1">Severity Rating</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map(sev => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setNewSeverity(sev)}
                        className={`text-xs p-2 rounded-lg font-semibold border capitalize transition ${
                          newSeverity === sev
                            ? sev === 'high'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : sev === 'medium'
                              ? 'bg-orange-50 text-orange-700 border-orange-300'
                              : 'bg-teal/5 text-teal border-teal/30'
                            : 'bg-white text-stone-gray border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loss Category Buttons (Interactive Selection, No Dropdown) */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-navy uppercase mb-2 tracking-wider">
                  Select Loss Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      key: 'Hail Bruising',
                      title: 'Hail Bruising',
                      desc: 'Circular indentations that crush the shingle core and knock off protective stone granules.',
                      indicator: 'Covered by storm insurance'
                    },
                    {
                      key: 'Wind-Fractured Shingles',
                      title: 'Wind Creases',
                      desc: 'Horizontal crease lines near the sealing line where high winds fold the shingle up.',
                      indicator: 'Immediate storm damage'
                    },
                    {
                      key: 'Cosmetic Blistering',
                      title: 'Blistering',
                      desc: 'Popped moisture pockets. Usually due to wear, bad ventilation, and heat.',
                      indicator: 'Wear & tear (Not covered)'
                    },
                    {
                      key: 'Exposed Underlayment',
                      title: 'Exposed Deck',
                      desc: 'Shingles have blown away, revealing bare tar paper. High water ingress hazard.',
                      indicator: 'Urgent temporary patch needed'
                    }
                  ].map(categoryItem => {
                    const isActive = newDamageType === categoryItem.key;
                    return (
                      <button
                        key={categoryItem.key}
                        type="button"
                        onClick={() => setNewDamageType(categoryItem.key as any)}
                        className={`p-3 rounded-xl border text-left transition duration-200 ${
                          isActive 
                            ? 'bg-teal/5 border-teal/40 ring-2 ring-teal/30 shadow-sm' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                            {categoryItem.title}
                            {isActive && <Check className="w-3.5 h-3.5 text-teal" />}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-gray leading-tight mb-2 font-medium">{categoryItem.desc}</p>
                        <span className={`text-[9px] font-bold block uppercase tracking-wide ${
                          isActive ? 'text-teal' : 'text-slate-400'
                        }`}>
                          {categoryItem.indicator}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Upload Panel (Up to 5) */}
              <div className="mb-4" id="damage-pin-photo-upload-container">
                <label className="block text-[11px] font-bold text-navy uppercase mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-teal" />
                    Upload Damage Photos (Up to 5)
                  </span>
                  <span className="text-[9px] text-teal font-semibold normal-case bg-teal/10 px-1.5 py-0.5 rounded">
                    {uploadedPreviews.length} / 5 Selected
                  </span>
                </label>
                
                <div className="flex flex-col gap-3">
                  <div className="w-full">
                    <label 
                      className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-teal bg-white hover:bg-slate-50/50 transition duration-200 ${
                        uploadedPreviews.length >= 5 ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (uploadedPreviews.length >= 5) return;
                        
                        const files = Array.from(e.dataTransfer.files || []) as File[];
                        if (files.length > 0) {
                          setIsUploading(true);
                          const spaceRemaining = 5 - uploadedPreviews.length;
                          const filesToProcess = files.slice(0, spaceRemaining);
                          
                          if (filesToProcess.length === 0) {
                            setIsUploading(false);
                            return;
                          }

                          const promises = filesToProcess.map(file => {
                            return new Promise<string>((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                resolve(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            });
                          });

                          Promise.all(promises).then(urls => {
                            setUploadedPreviews(prev => [...prev, ...urls]);
                            setIsUploading(false);
                          }).catch(() => {
                            setIsUploading(false);
                          });
                        }
                      }}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal border-t-transparent mb-1" />
                        ) : (
                          <Upload className="w-5 h-5 text-stone-gray mb-1" />
                        )}
                        <p className="text-[11px] text-navy font-semibold">
                          {uploadedPreviews.length >= 5 ? 'Maximum limit of 5 photos reached' : 'Click to select or drag photos'}
                        </p>
                        <p className="text-[9px] text-stone-gray">
                          PNG, JPG, or JPEG (Max 10MB per file)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        disabled={uploadedPreviews.length >= 5}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []) as File[];
                          if (files.length > 0) {
                            setIsUploading(true);
                            const spaceRemaining = 5 - uploadedPreviews.length;
                            const filesToProcess = files.slice(0, spaceRemaining);

                            if (filesToProcess.length === 0) {
                              setIsUploading(false);
                              return;
                            }

                            const promises = filesToProcess.map(file => {
                              return new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  resolve(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              });
                            });

                            Promise.all(promises).then(urls => {
                              setUploadedPreviews(prev => [...prev, ...urls]);
                              setIsUploading(false);
                              e.target.value = ''; // Reset file input so users can select sequentially
                            }).catch(() => {
                              setIsUploading(false);
                              e.target.value = '';
                            });
                          }
                        }}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {uploadedPreviews.length > 0 ? (
                    <div className="grid grid-cols-5 gap-2">
                      {uploadedPreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                          <img 
                            src={preview} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => setUploadedPreviews(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                            title="Remove Photo"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-mono font-bold">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="hidden md:flex flex-col items-center justify-center h-16 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-stone-gray text-center p-2 italic border-dashed">
                      No photos uploaded (default backup image will be used if none uploaded)
                    </div>
                  )}
                </div>
              </div>

              {/* Video upload option for each pin */}
              <div className="mb-4 bg-slate-50/50 border border-slate-200/50 p-4 rounded-xl shadow-sm" id="damage-pin-video-upload-container">
                <label className="block text-[11px] font-bold text-navy uppercase mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-teal" />
                    Upload Video Evidence
                  </span>
                  <span className="text-[9px] text-teal font-semibold bg-teal/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                    Max 50MB • MP4/MOV/WEBM
                  </span>
                </label>

                {/* Homeowner Video Guidelines */}
                <div className="bg-teal-50/60 border border-teal-100/80 rounded-xl p-3.5 mb-4 text-xs text-teal-900 leading-relaxed shadow-sm">
                  <p className="font-bold text-navy mb-1.5 uppercase tracking-wide text-[11px] flex items-center gap-1">
                    <Info className="w-4 h-4 text-teal" />
                    Homeowner Guide: How to Capture a Good Video
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-stone-gray text-[11px] font-medium">
                    <li><strong className="text-navy font-semibold">Stay Safe:</strong> Capture all footage from the ground or a safe window. <span className="text-red-600 font-semibold">NEVER climb ladders or walk on the roof!</span></li>
                    <li><strong className="text-navy font-semibold">Keep It Brief:</strong> A quick 5 to 30-second clip of the damaged area is best to easily stay under our 50MB limit.</li>
                    <li><strong className="text-navy font-semibold">Slow & Steady:</strong> Avoid rapid movement. Hold the camera steady and pan slowly across the damage.</li>
                    <li><strong className="text-navy font-semibold">Show Context:</strong> Start with a wider view showing a landmark (e.g., a window or chimney) so contractors can easily locate the spot.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Drop Zone */}
                  <div>
                    <label 
                      className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-teal bg-white hover:bg-slate-50/50 transition duration-200 ${
                        uploadedVideo ? 'opacity-60 pointer-events-none' : ''
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (uploadedVideo) return;
                        
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          handleVideoFile(file);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        {isUploadingVideo ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal border-t-transparent mb-1" />
                        ) : (
                          <Upload className="w-5 h-5 text-stone-gray mb-1" />
                        )}
                        <p className="text-[11px] text-navy font-semibold">
                          {uploadedVideo ? 'Video uploaded successfully' : 'Drag & drop video, or click to browse'}
                        </p>
                        <p className="text-[9px] text-stone-gray">
                          Supported: .mp4, .mov, .webm
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="video/mp4,video/quicktime,video/webm" 
                        disabled={!!uploadedVideo}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleVideoFile(file);
                          }
                        }}
                        className="hidden" 
                      />
                    </label>
                    {videoSizeError && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {videoSizeError}
                      </p>
                    )}
                  </div>

                  {/* Video Preview */}
                  <div className="flex flex-col justify-center">
                    {uploadedVideo ? (
                      <div className="bg-slate-900 rounded-xl overflow-hidden relative aspect-video flex items-center justify-center shadow-sm w-full max-w-sm mx-auto">
                        <video 
                          src={uploadedVideo} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedVideo(null);
                            setVideoSizeError(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition z-10"
                          title="Remove Video"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-24 bg-slate-100/50 border border-slate-200 rounded-xl text-[10px] text-stone-gray text-center p-3 italic border-dashed w-full max-w-sm mx-auto">
                        <VideoOff className="w-6 h-6 text-slate-300 mb-1" />
                        No video uploaded yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Narration guidelines to tell us what we are looking at */}
                <div className="mt-4">
                  <label className="block text-[10.5px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-amber" />
                    Tell us what we are looking at in the video:
                  </label>
                  <textarea
                    value={videoNarration}
                    onChange={(e) => setVideoNarration(e.target.value)}
                    placeholder="e.g. 'I am pointing the camera at the wind-torn shingle on the northeast eave. You can see the underlayment flapping in the wind, and there is a damp stain forming...'"
                    className="w-full bg-white border border-slate-200 focus:border-teal rounded-lg text-xs p-2.5 h-20 focus:ring-1 focus:ring-teal focus:outline-none resize-none font-medium leading-relaxed"
                  />
                </div>
              </div>



              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingPin(false);
                    setNewPinCoords(null);
                    setUploadedPreviews([]);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-stone-gray hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePin}
                  id="save-pin-submit-btn"
                  className="px-4 py-1.5 rounded-lg bg-teal hover:bg-teal/90 text-white text-xs font-bold shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Pin Details & Markup Engine */}
        {selectedPin && !isAddingPin && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            {isEditingSelectedPin ? (
              <div className="bg-amber/5 border border-amber/20 rounded-2xl p-4 md:p-5 mb-5 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-bold text-navy text-sm flex items-center gap-1.5">
                    <Pencil className="w-4 h-4 text-amber" />
                    Edit Selected Pin Details
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingSelectedPin(false)}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-stone-gray font-semibold rounded-lg hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdatePin}
                      id="update-pin-btn"
                      className="px-4 py-1.5 text-xs bg-teal hover:bg-teal/90 text-white font-bold rounded-lg shadow-sm transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-navy uppercase mb-1.5">Severity Rating</label>
                    <div className="grid grid-cols-3 gap-2 max-w-md">
                      {(['low', 'medium', 'high'] as const).map(sev => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setEditSeverity(sev)}
                          className={`text-xs p-2 rounded-lg font-semibold border capitalize transition ${
                            editSeverity === sev
                              ? sev === 'high'
                                ? 'bg-red-50 text-red-700 border-red-300'
                                : sev === 'medium'
                                ? 'bg-orange-50 text-orange-700 border-orange-300'
                                : 'bg-teal/5 text-teal border-teal/30'
                              : 'bg-white text-stone-gray border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loss Category Buttons for Edit Mode */}
                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase mb-2 tracking-wider">
                    Select Loss Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        key: 'Hail Bruising',
                        title: 'Hail Bruising',
                        desc: 'Circular indentations that crush shingle core.',
                        indicator: 'Covered by storm insurance'
                      },
                      {
                        key: 'Wind-Fractured Shingles',
                        title: 'Wind Creases',
                        desc: 'Horizontal crease lines near seal line.',
                        indicator: 'Immediate storm damage'
                      },
                      {
                        key: 'Cosmetic Blistering',
                        title: 'Blistering',
                        desc: 'Popped moisture pockets. Wear and heat.',
                        indicator: 'Wear & tear (Not covered)'
                      },
                      {
                        key: 'Exposed Underlayment',
                        title: 'Exposed Deck',
                        desc: 'Shingles blown away, revealing bare deck.',
                        indicator: 'Urgent temporary patch needed'
                      }
                    ].map(categoryItem => {
                      const isActive = editDamageType === categoryItem.key;
                      return (
                        <button
                          key={categoryItem.key}
                          type="button"
                          onClick={() => setEditDamageType(categoryItem.key as any)}
                          className={`p-3 rounded-xl border text-left transition duration-200 ${
                            isActive 
                              ? 'bg-teal/5 border-teal/40 ring-2 ring-teal/30 shadow-sm' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-navy text-xs flex items-center gap-1.5">
                              {categoryItem.title}
                              {isActive && <Check className="w-3.5 h-3.5 text-teal" />}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-gray leading-tight mb-2 font-medium">{categoryItem.desc}</p>
                          <span className={`text-[9px] font-bold block uppercase tracking-wide ${
                            isActive ? 'text-teal' : 'text-slate-400'
                          }`}>
                            {categoryItem.indicator}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider mb-1 ${
                    selectedPin.severity === 'high'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : selectedPin.severity === 'medium'
                      ? 'bg-orange-50 text-orange-600 border border-orange-100'
                      : 'bg-teal/10 text-teal border border-teal/20'
                  }`}>
                    {selectedPin.severity} Severity Location
                  </span>
                  <h3 className="font-display font-bold text-navy text-base leading-tight">
                    {selectedPin.facetName} — {selectedPin.damageType}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditDamageType(selectedPin.damageType);
                      setEditNotes(selectedPin.notes);
                      setEditSeverity(selectedPin.severity);
                      setIsEditingSelectedPin(true);
                    }}
                    className="text-teal hover:text-teal-600 p-1.5 hover:bg-teal/5 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                    title="Edit pin details"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Pin</span>
                  </button>
                  <button
                    onClick={() => handleDeletePin(selectedPin.id)}
                    id={`delete-pin-btn-${selectedPin.id}`}
                    className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-lg transition"
                    title="Delete this pin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Photo Area with markup drawing canvas */}
              <div 
                id="damage-pin-photo-card"
                className={`${
                  isExpanded ? 'md:col-span-12' : 'md:col-span-5'
                } relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group flex flex-col items-stretch transition-all duration-300 shadow-sm`}
                style={{ height: isExpanded ? '540px' : '360px' }}
              >
                {/* Header Bar */}
                <div className="bg-navy px-3 py-2 flex justify-between items-center text-white shrink-0 z-20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                    <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-amber">
                      {isDrawingMode ? 'Drawing Workspace' : 'Site Photo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Expand/Collapse Button */}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-1 hover:bg-white/10 text-slate-300 hover:text-white rounded transition"
                      title={isExpanded ? "Collapse View" : "Expand View"}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isDrawingMode ? (
                  <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
                    <img
                      src={canvasImage}
                      alt="Damage site detail"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover absolute inset-0 select-none ${
                        photoZoom > 1 
                          ? isDraggingPhoto 
                            ? 'cursor-grabbing' 
                            : 'cursor-grab' 
                          : 'cursor-default'
                      }`}
                      style={{
                        transform: `translate(${photoPan.x}px, ${photoPan.y}px) scale(${photoZoom})`,
                        transformOrigin: 'center',
                        transition: isDraggingPhoto ? 'none' : 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseDown={handlePhotoMouseDown}
                      onMouseMove={handlePhotoMouseMove}
                      onMouseUp={handlePhotoMouseUp}
                      onMouseLeave={handlePhotoMouseLeave}
                    />

                    {/* Drag to pan hint */}
                    {photoZoom > 1 && (
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-[10px] text-teal font-bold px-2 py-1 rounded-lg border border-teal/20 pointer-events-none select-none animate-bounce z-10">
                        Drag to Pan
                      </div>
                    )}

                    {isEditingSelectedPin && photoZoom === 1 && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition duration-200 z-10">
                        <button
                          onClick={() => setIsDrawingMode(true)}
                          id="start-markup-btn"
                          className="px-4 py-2 rounded-xl bg-white text-navy hover:bg-amber hover:text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
                        >
                          <Pencil className="w-4 h-4 text-teal" />
                          Draw on Photo
                        </button>
                      </div>
                    )}

                    {/* Floating Zoom Controls for Photo */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 z-25 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoZoom(prev => {
                            const next = Math.max(prev - 0.5, 1);
                            if (next === 1) setPhotoPan({ x: 0, y: 0 });
                            return next;
                          });
                        }}
                        disabled={photoZoom === 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:hover:bg-slate-800 transition-all flex items-center justify-center"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="text-[10px] font-bold font-mono text-white min-w-[32px] text-center select-none">
                        {Math.round(photoZoom * 100)}%
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setPhotoZoom(prev => Math.min(prev + 0.5, 4));
                        }}
                        disabled={photoZoom === 4}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:hover:bg-slate-800 transition-all flex items-center justify-center"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>

                      {photoZoom !== 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoZoom(1);
                            setPhotoPan({ x: 0, y: 0 });
                          }}
                          className="text-[9px] bg-teal hover:bg-teal-600 text-white font-extrabold px-2.5 py-1.5 rounded-lg transition-all ml-1 shadow-sm"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between bg-white relative overflow-hidden">
                    {/* Control Bar for Drawing */}
                    <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap justify-between items-center gap-2 shrink-0 z-20">
                      {/* Tool Selection (Brush vs Eraser) */}
                      <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700/40">
                        <button
                          type="button"
                          onClick={() => setIsEraser(false)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                            !isEraser ? 'bg-teal text-white shadow-sm' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Pen
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEraser(true)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                            isEraser ? 'bg-amber text-white shadow-sm' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Eraser className="w-3.5 h-3.5" />
                          Eraser
                        </button>
                      </div>

                      {/* Brush Colors (disabled in eraser mode) */}
                      <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/40">
                        {[
                          { color: '#ef4444', name: 'Red' },
                          { color: '#f59e0b', name: 'Amber' },
                          { color: '#ec4899', name: 'Pink' },
                          { color: '#10b981', name: 'Green' },
                          { color: '#3b82f6', name: 'Blue' },
                          { color: '#8b5cf6', name: 'Purple' },
                          { color: '#eab308', name: 'Yellow' },
                          { color: '#0f172a', name: 'Slate' },
                          { color: '#ffffff', name: 'White' },
                        ].map(item => (
                          <button
                            key={item.color}
                            type="button"
                            disabled={isEraser}
                            onClick={() => {
                              setDrawingColor(item.color);
                              setIsEraser(false);
                            }}
                            className={`w-4 h-4 rounded-full border border-white/20 relative transition ${
                              isEraser ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
                            } ${
                              drawingColor === item.color && !isEraser ? 'ring-2 ring-teal ring-offset-1 ring-offset-slate-900 scale-110' : ''
                            }`}
                            style={{ backgroundColor: item.color }}
                            title={item.name}
                          />
                        ))}
                      </div>

                      {/* Thickness Slider */}
                      <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/40">
                        <Sliders className="w-3.5 h-3.5 text-teal" />
                        <span className="text-[10px] font-semibold text-slate-300">Thickness:</span>
                        <input
                          type="range"
                          min="1"
                          max="24"
                          value={lineWidth}
                          onChange={(e) => setLineWidth(Number(e.target.value))}
                          className="w-16 md:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal"
                        />
                        <span className="text-[10px] font-mono font-bold text-teal w-6 text-right">{lineWidth}px</span>
                      </div>

                      {/* Zoom Controls */}
                      <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/40">
                        <button
                          type="button"
                          onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                          disabled={zoomLevel === 1}
                          className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold font-mono text-white w-9 text-center">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                          type="button"
                          onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
                          disabled={zoomLevel === 3}
                          className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        {zoomLevel !== 1 && (
                          <button
                            type="button"
                            onClick={() => setZoomLevel(1)}
                            className="text-[9px] bg-slate-700 hover:bg-slate-600 text-white font-bold px-1.5 py-0.5 rounded transition"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* The Scrollable Viewport */}
                    <div className="flex-1 overflow-auto relative bg-slate-900 select-none flex items-center justify-center p-4">
                      {/* Scale/Zoom Wrapper */}
                      <div
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center',
                          width: '100%',
                          height: '100%',
                          maxWidth: '800px',
                          maxHeight: '600px',
                        }}
                        className="relative aspect-[4/3] bg-black/40 rounded shadow-md transition-transform duration-200 overflow-hidden shrink-0"
                      >
                        {/* Underlay Photo (Static Background) */}
                        <img
                          src={canvasImage}
                          alt="Original layout"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                          referrerPolicy="no-referrer"
                        />

                        {/* Active Transparent Drawing Canvas */}
                        <canvas
                          ref={markupCanvasRef}
                          width={800}
                          height={600}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                        />
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="bg-slate-100 p-2 flex justify-between items-center border-t border-slate-200 shrink-0 z-20">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-gray font-semibold">
                        <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                        {isEraser ? 'Eraser Mode Active' : `Drawing Brush Active (${drawingColor})`}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDrawingMode(false);
                            setZoomLevel(1);
                          }}
                          className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg text-stone-gray font-semibold hover:bg-slate-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={resetMarkup}
                          className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg text-red-500 font-semibold flex items-center gap-1 hover:bg-red-50 transition"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                        <button
                          type="button"
                          onClick={saveMarkup}
                          id="save-markup-btn"
                          className="px-3 py-1 text-[11px] bg-teal text-white rounded-lg font-bold flex items-center gap-1 hover:bg-teal/90 shadow-sm transition"
                        >
                          <Check className="w-3 h-3" /> Save Markup
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className={`${isExpanded ? 'md:col-span-12' : 'md:col-span-7'} flex flex-col justify-start gap-4`}>
                <div>
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Homeowner Notes {isEditingSelectedPin ? '' : '(Read Only)'}</span>
                    <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-mono font-bold animate-fadeIn">
                      Photo #{activePhotoIndex + 1} of {selectedPin.photoUrls?.length || 1}
                    </span>
                  </h4>
                  <textarea
                    value={selectedPin.photoNotes?.[activePhotoIndex] ?? (activePhotoIndex === 0 ? selectedPin.notes : '')}
                    onChange={(e) => {
                      if (!isEditingSelectedPin) return;
                      const updatedNotes = e.target.value;
                      const currentPhotoNotes = [...(selectedPin.photoNotes || [])];
                      const totalPhotosCount = selectedPin.photoUrls?.length || 1;
                      
                      while (currentPhotoNotes.length < totalPhotosCount) {
                        currentPhotoNotes.push('');
                      }
                      currentPhotoNotes[activePhotoIndex] = updatedNotes;
                      
                      const updatedPin: DamagePin = {
                        ...selectedPin,
                        notes: activePhotoIndex === 0 ? updatedNotes : selectedPin.notes,
                        photoNotes: currentPhotoNotes
                      };
                      
                      setSelectedPin(updatedPin);
                      
                      const updatedPins = pins.map(p => {
                        if (p.id === selectedPin.id) {
                          return {
                            ...p,
                            notes: activePhotoIndex === 0 ? updatedNotes : p.notes,
                            photoNotes: currentPhotoNotes
                          };
                        }
                        return p;
                      });
                      onPinsChange(updatedPins);
                    }}
                    readOnly={!isEditingSelectedPin}
                    placeholder={isEditingSelectedPin ? `Enter custom homeowner notes, physical conditions, attic leaks, or observations for Photo #${activePhotoIndex + 1}...` : "No custom notes entered for this photo."}
                    className={`w-full border-2 rounded-xl text-xs md:text-sm p-3.5 h-32 focus:outline-none transition-all resize-none shadow-sm font-medium ${
                      isEditingSelectedPin 
                        ? 'bg-slate-50 hover:bg-white focus:bg-white border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/10'
                        : 'bg-slate-50/50 border-slate-200/60 cursor-not-allowed select-text'
                    }`}
                  />
                </div>

                {/* Pin Photos Gallery */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 shadow-sm">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>Pin Photo Evidence Gallery ({selectedPin.photoUrls?.length || 1})</span>
                    <span className="text-[10px] text-teal font-semibold bg-teal/5 px-2 py-0.5 rounded">
                      Click thumbnail to load in workspace
                    </span>
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {(selectedPin.photoUrls && selectedPin.photoUrls.length > 0
                      ? selectedPin.photoUrls
                      : [selectedPin.photoUrl || 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop']
                    ).map((pUrl, idx) => {
                      const isSelected = activePhotoIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 group/thumb ${
                            isSelected
                              ? 'ring-2 ring-teal ring-offset-2 border-teal scale-105 z-10 shadow-md'
                              : 'border-slate-200 hover:border-slate-300 hover:scale-[1.02]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActivePhotoIndex(idx);
                              setCanvasImage(pUrl);
                              setIsDrawingMode(false);
                            }}
                            className="w-full h-full text-left p-0 border-0 focus:outline-none focus:ring-0 block"
                          >
                            <img
                              src={pUrl}
                              alt={`Evidence ${idx + 1}`}
                              className={`w-full h-full object-cover transition duration-300 ${
                                isSelected ? 'opacity-100' : 'opacity-75 group-hover/thumb:opacity-100'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                          </button>
                          
                          {/* Image Index badge */}
                          <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[8px] font-mono px-1.5 py-0.5 rounded-md font-bold z-10 select-none">
                            #{idx + 1}
                          </span>

                          {/* Delete Photo Button - only allowed when editing pin */}
                          {isEditingSelectedPin && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleRemoveSelectedPinPhoto(idx);
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-lg p-1 shadow-md transition-all duration-200 opacity-0 group-hover/thumb:opacity-100 focus:opacity-100 z-20 flex items-center justify-center border border-red-400/20"
                              title="Delete this image"
                            >
                              <X className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Photo tile in Edit mode */}
                    {isEditingSelectedPin && (selectedPin.photoUrls?.length || 1) < 5 && (
                      <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-teal bg-white hover:bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group/add">
                        <Camera className="w-5 h-5 text-stone-gray group-hover/add:text-teal transition-colors" />
                        <span className="text-[9px] font-bold text-stone-gray group-hover/add:text-teal mt-1 select-none">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []) as File[];
                            if (files.length > 0) {
                              const currentUrls = selectedPin.photoUrls && selectedPin.photoUrls.length > 0
                                ? [...selectedPin.photoUrls]
                                : [selectedPin.photoUrl || 'https://images.unsplash.com/photo-1631651352404-c24e77545935?q=80&w=600&auto=format&fit=crop'];
                              
                              const currentNotes = selectedPin.photoNotes && selectedPin.photoNotes.length > 0
                                ? [...selectedPin.photoNotes]
                                : [selectedPin.notes || 'No notes provided.'];

                              const spaceRemaining = 5 - currentUrls.length;
                              const filesToProcess = files.slice(0, spaceRemaining);

                              const promises = filesToProcess.map(file => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              });

                              Promise.all(promises).then(urls => {
                                const updatedUrls = [...currentUrls, ...urls];
                                const updatedNotes = [...currentNotes, ...Array(urls.length).fill('')];
                                
                                const updatedPin: DamagePin = {
                                  ...selectedPin,
                                  photoUrl: updatedUrls[0],
                                  photoUrls: updatedUrls,
                                  photoNotes: updatedNotes
                                };

                                setSelectedPin(updatedPin);
                                const updatedPins = pins.map(p => p.id === selectedPin.id ? updatedPin : p);
                                onPinsChange(updatedPins);
                                e.target.value = '';
                              });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Pin Video Evidence */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border-2 border-teal/10 rounded-2xl p-5 shadow-md mt-4 transition-all duration-300 hover:shadow-lg hover:border-teal/20" id="selected-pin-video-evidence-container">
                  {(() => {
                    const currentVideoUrl = selectedPin.videoUrls?.[activePhotoIndex] || (activePhotoIndex === 0 ? selectedPin.videoUrl : undefined);
                    const currentVideoNarration = selectedPin.videoNarrations?.[activePhotoIndex] || (activePhotoIndex === 0 ? selectedPin.videoNarration : undefined);
                    
                    return (
                      <>
                        <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-3 flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-teal">
                            <Video className="w-4 h-4" />
                            <span>Video Evidence for Photo #{activePhotoIndex + 1}</span>
                          </span>
                          {currentVideoUrl && isEditingSelectedPin && (
                            <button
                              type="button"
                              onClick={handleRemoveSelectedPinVideo}
                              className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-lg transition"
                              title="Remove video evidence"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Video</span>
                            </button>
                          )}
                        </h4>
                        
                        {currentVideoUrl ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-center">
                              <div className="w-full bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-inner border border-slate-200/50">
                                <video 
                                  key={`${selectedPin.id}-${activePhotoIndex}-${currentVideoUrl}`}
                                  src={currentVideoUrl} 
                                  controls 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col justify-between bg-white border border-slate-200/50 rounded-xl p-3 shadow-sm">
                              <div className="space-y-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Homeowner Context & Notes {isEditingSelectedPin ? '(Editable)' : '(Read Only)'}
                                </span>
                                <textarea
                                  value={currentVideoNarration || ''}
                                  onChange={(e) => {
                                    if (!isEditingSelectedPin) return;
                                    const updatedNarration = e.target.value;
                                    const totalPhotosCount = selectedPin.photoUrls?.length || 1;
                                    const currentNarrations = selectedPin.videoNarrations && selectedPin.videoNarrations.length > 0
                                      ? [...selectedPin.videoNarrations]
                                      : Array(totalPhotosCount).fill(undefined);
                                      
                                    while (currentNarrations.length < totalPhotosCount) {
                                      currentNarrations.push(undefined);
                                    }
                                    
                                    currentNarrations[activePhotoIndex] = updatedNarration;

                                    const updatedPin: DamagePin = {
                                      ...selectedPin,
                                      videoNarration: activePhotoIndex === 0 ? updatedNarration : selectedPin.videoNarration,
                                      videoNarrations: currentNarrations
                                    };
                                    setSelectedPin(updatedPin);
                                    const updatedPins = pins.map(p => p.id === selectedPin.id ? updatedPin : p);
                                    onPinsChange(updatedPins);
                                  }}
                                  readOnly={!isEditingSelectedPin}
                                  placeholder={isEditingSelectedPin ? "Type or edit video context/narration here..." : "No walkthrough notes were entered for this video."}
                                  className={`w-full border-2 rounded-xl text-xs p-3 h-28 focus:outline-none transition-all resize-none shadow-sm font-medium leading-relaxed ${
                                    isEditingSelectedPin
                                      ? 'bg-slate-50 hover:bg-white focus:bg-white border-slate-200 focus:border-teal focus:ring-2 focus:ring-teal/10'
                                      : 'bg-slate-50/50 border-slate-200/60 cursor-not-allowed select-text'
                                  }`}
                                />
                              </div>
                              <div className="text-[10px] text-teal font-semibold flex items-center gap-1.5 mt-4 pt-2 border-t border-slate-100">
                                <Check className="w-4 h-4 text-teal shrink-0" />
                                <span>Pinned walkthrough video evidence for Photo #{activePhotoIndex + 1}</span>
                              </div>
                            </div>
                          </div>
                        ) : isEditingSelectedPin ? (
                          <div>
                            {/* Upload new video section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label 
                                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-teal bg-white hover:bg-slate-50/50 transition duration-200"
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                      handleSelectedPinVideoFile(file);
                                    }
                                  }}
                                >
                                  <div className="flex flex-col items-center justify-center text-center">
                                    {isUploadingVideo ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal border-t-transparent mb-1" />
                                    ) : (
                                      <Upload className="w-5 h-5 text-stone-gray mb-1" />
                                    )}
                                    <p className="text-[11px] text-navy font-semibold">
                                      Drag & drop video, or click to browse
                                    </p>
                                    <p className="text-[9px] text-stone-gray">
                                      Supported: .mp4, .mov, .webm (Max 50MB)
                                    </p>
                                  </div>
                                  <input 
                                    type="file" 
                                    accept="video/mp4,video/quicktime,video/webm" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleSelectedPinVideoFile(file);
                                      }
                                    }}
                                    className="hidden" 
                                  />
                                </label>
                                {videoSizeError && (
                                  <p className="text-[10px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {videoSizeError}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col justify-center items-center h-24 bg-white border border-slate-200/50 rounded-xl text-[10px] text-stone-gray text-center p-3 italic border-dashed">
                                <VideoOff className="w-6 h-6 text-slate-300 mb-1" />
                                No video uploaded for Photo #{activePhotoIndex + 1} yet. Upload one now.
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/60 rounded-xl text-center shadow-sm">
                            <VideoOff className="w-8 h-8 text-slate-300 mb-2 animate-fadeIn" />
                            <p className="text-xs font-semibold text-navy">No video walkthrough evidence attached to Photo #{activePhotoIndex + 1}.</p>
                            <p className="text-[10px] text-stone-gray mt-1">To upload video walkthroughs or notes, select the <strong className="text-teal font-bold">Edit Pin</strong> button above.</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Smart Material & Volume Calculator (4 columns) */}
      <div className="lg:col-span-4 bg-navy border border-deep-slate rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col justify-start gap-5">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-amber animate-pulse" />
            <h2 className="font-display font-bold text-white text-lg">
              Smart Scope Calculator
            </h2>
          </div>

          <p className="text-mist text-xs mb-5">
            Auto-derived from Google Solar API 3D elevation data. Compare different building materials and waste levels below to block predatory volume inflation.
          </p>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 gap-4 bg-deep-slate/50 p-3 rounded-xl border border-slate-700/30 mb-5">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Measured Area</span>
              <div className="text-xl font-bold font-display text-white">32.0 Squares</div>
              <span className="text-[9px] text-slate-400">3,200 sq. feet</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Dominant Pitch</span>
              <div className="text-xl font-bold font-display text-white">6:12 standard</div>
              <span className="text-[9px] text-slate-400">Medium slope</span>
            </div>
          </div>

          {/* Shingle Type Selector */}
          <div className="space-y-2 mb-5">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Select Roofing Material
            </label>
            <div className="grid grid-cols-3 gap-2 relative">
              {(['3tab', 'architectural', 'metal', 'slate', 'wood', 'clay'] as const).map(tier => (
                <button
                  key={tier}
                  onMouseEnter={() => setHoveredTier(tier)}
                  onMouseLeave={() => setHoveredTier(null)}
                  onClick={() => setMaterialTier(tier)}
                  className={`text-center p-2 rounded-lg border text-xs font-bold transition-all duration-200 flex flex-col justify-between h-14 relative ${
                    materialTier === tier
                      ? 'bg-amber border-amber text-navy scale-[1.02] shadow-md'
                      : 'bg-deep-slate/40 border-slate-700 text-mist hover:bg-deep-slate/80'
                  }`}
                >
                  <span className="text-[9px] block opacity-80 uppercase truncate w-full">
                    {tier === '3tab' ? '3-Tab' : tier === 'architectural' ? 'Laminate' : tier === 'metal' ? 'Metal' : tier === 'slate' ? 'Slate' : tier === 'wood' ? 'Wood' : 'Clay'}
                  </span>
                  <span className="block mt-1 font-mono text-[9px] opacity-90 truncate w-full">
                    {tier === '3tab' ? 'Base' : tier === 'architectural' ? 'Standard' : tier === 'metal' ? 'Premium' : tier === 'slate' ? 'Heritage' : tier === 'wood' ? 'Natural' : 'Luxury'}
                  </span>

                  {/* Hover Image Preview Tooltip */}
                  {hoveredTier === tier && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 pointer-events-none animate-fadeIn">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-1.5 bg-slate-800">
                        <img
                          src={materialImages[tier]}
                          alt={tier}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-[10px] text-white font-extrabold mb-0.5 text-center truncate">
                        {tier === '3tab' ? 'Traditional 3-Tab' : tier === 'architectural' ? 'Architectural Shingles' : tier === 'metal' ? 'Standing Seam Metal' : tier === 'slate' ? 'Natural Welsh Slate' : tier === 'wood' ? 'Cedar Shakes' : 'Spanish Clay Tiles'}
                      </div>
                      <p className="text-[8px] text-slate-300 text-center leading-normal line-clamp-2">
                        {tier === '3tab'
                          ? 'Economic, traditional flat asphalt layers.'
                          : tier === 'architectural'
                          ? 'Stunning dimensional look, high wind resistance.'
                          : tier === 'metal'
                          ? 'Ultra-resilient modern panels, sheds ice instantly.'
                          : tier === 'slate'
                          ? 'Indestructible premium slate tiles with 100+ year life.'
                          : tier === 'wood'
                          ? 'Organic, beautifully insulated rustic red cedar.'
                          : 'Iconic curved terracotta clay barrels, energy-efficient.'}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Waste Factor Selector */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Lumber Waste Factor
              </label>
              <span className="text-xs font-bold text-amber">{wasteFactor}% waste</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 10, 15].map(factor => (
                <button
                  key={factor}
                  onClick={() => setWasteFactor(factor)}
                  className={`py-1.5 rounded-lg border text-xs font-bold font-mono transition ${
                    wasteFactor === factor
                      ? 'bg-teal border-teal text-white'
                      : 'bg-deep-slate/40 border-slate-700 text-mist hover:bg-deep-slate/80'
                  }`}
                >
                  {factor}% {factor === 3 ? '(Hip)' : factor === 10 ? '(Gable)' : '(Complex)'}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber shrink-0" />
              Standard gables need 10%. Predatory roofers often inflate waste factors to 18-20% to pad bills.
            </p>
          </div>

          {/* Dynamic Specs Output */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">True Material Needs:</span>
              <span className="font-bold text-white font-mono">{totalSquaresNeeded} Squares</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-teal" />
                Dead structural load:
              </span>
              <span className="font-bold text-white font-mono">{estimatedTotalWeightLbs.toLocaleString()} lbs</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal" />
                Wind Velocity Cycle:
              </span>
              <span className="font-bold text-amber font-mono">{materialDetails.windRating}</span>
            </div>
          </div>
        </div>

        <div className="bg-deep-slate p-4 rounded-xl border border-slate-800/60 mt-6 space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Detailed Cost Breakdown</span>
            <span className="text-[10px] bg-teal/20 text-teal px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Unbiased SaaS Guide</span>
          </div>

          <div className="space-y-2.5">
            {[
              costBreakdown.materials,
              costBreakdown.labor,
              costBreakdown.tearOff,
              costBreakdown.underlayment,
              costBreakdown.permits
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/30 pb-2.5 last:border-0 last:pb-0">
                <div className="flex-1 pr-4">
                  <div className="font-semibold text-white text-[11px]">{item.name}</div>
                  <div className="text-[10px] text-slate-400 leading-normal mt-0.5">{item.desc}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-amber text-[11px]">
                    ${item.low.toLocaleString()} - ${item.high.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Total Est. Cost Range</span>
            <span className="text-lg font-bold font-display text-teal font-mono text-right shrink-0">
              ${calculatedTotalLow.toLocaleString()} - ${calculatedTotalHigh.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
