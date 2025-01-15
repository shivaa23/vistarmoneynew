import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

const BbpsCardComponent = ({ title, img, onClick, height, isSelected = false }) => {
  // Calculate the number of words in the title
  const wordCount = title.split(' ').length;

  // Define the font size based on the word count
  const fontSize = wordCount > 9 ? '0.8rem' : '1rem'; // Adjust font sizes as needed

  return (
    <Tooltip title={title} placement="top">
      <Box
        className={isSelected ? "card-selected" : "card-unselected"}
        sx={{
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(-65deg, var(--bg) 50%, var(--accent) 50%)',
          boxShadow: 2,
          borderRadius: '8px',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          width: '95%',
          height: height ? height : "75%",
          ml: 1,
          px: 0.5,
          py:2,
          mt: 2,
          overflow: 'hidden',
          backgroundClip: 'padding-box',
          position: 'relative',
          border: isSelected ? '2px solid #00693E' : '2px solid transparent', // Highlight border if selected

          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 4,
            border: '2px solid black',
            animation: 'pulse 1s infinite',
          },

          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
        onClick={onClick}
      >
        <img
          src={img}
          alt={title}
          width="40px"
          style={{ marginRight: '10px' }} 
        />

        {/* Operator name */}
        <Typography
          variant="subtitle1"
          sx={{
            ml: 1,
            fontWeight: 500,
            fontSize: fontSize, // Apply the dynamic font size here
            overflow: 'visible', // Allow text to wrap
            whiteSpace: 'normal', // Enable wrapping
            textOverflow: 'ellipsis',
            color: '#000', // Text color
          }}
        >
          {title}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default BbpsCardComponent;
