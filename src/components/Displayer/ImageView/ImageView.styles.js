export default {
  root: {
    overflow: 'hidden',
    position: 'relative',
    '& .cropper-modal': {
      background: 'none'
    }
  },
  viewMode: {
    '& .cropper-point': {
      background: 'none'
    },
    '& .cropper-view-box': {
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 0px 9999px'
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      display: 'block',
      zIndex: 1,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  hidden: {
    '& .cropper-container > *': {
      opacity: 0
    }
  },
  hiddenViewMode: {
    '&:before': {
      background: 'rgba(0, 0, 0, 0.5)'
    }
  },
  noCropBox: {
    '& .cropper-crop-box': {
      display: 'none'
    }
  }
};
