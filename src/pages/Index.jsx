import React, { useState, useEffect } from "react";
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { FaMousePointer } from "react-icons/fa";

const Index = () => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const toggleInspecting = () => {
    setIsInspecting(!isInspecting);
  };

  const handleElementMouseOver = (event) => {
    if (!isInspecting) return;
    event.stopPropagation();
    event.target.style.outline = "2px solid red";
  };

  const handleElementMouseOut = (event) => {
    if (!isInspecting) return;
    event.stopPropagation();
    event.target.style.outline = "none";
  };

  const handleElementRightClick = (event) => {
    if (!isInspecting) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedElement(event.target);
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const copyHtml = async () => {
    if (!selectedElement) return;
    const htmlContent = selectedElement.outerHTML;
    console.log("HTML Content:", htmlContent); // For demonstration, normally you would post this to a server
    setContextMenu(null); // Close context menu
  };

  useEffect(() => {
    if (isInspecting) {
      document.addEventListener("mouseover", handleElementMouseOver);
      document.addEventListener("mouseout", handleElementMouseOut);
      document.addEventListener("contextmenu", handleElementRightClick);
    } else {
      document.removeEventListener("mouseover", handleElementMouseOver);
      document.removeEventListener("mouseout", handleElementMouseOut);
      document.removeEventListener("contextmenu", handleElementRightClick);
    }

    return () => {
      document.removeEventListener("mouseover", handleElementMouseOver);
      document.removeEventListener("mouseout", handleElementMouseOut);
      document.removeEventListener("contextmenu", handleElementRightClick);
    };
  }, [isInspecting]);

  return (
    <Box>
      <Button leftIcon={<FaMousePointer />} colorScheme="blue" onClick={toggleInspecting}>
        {isInspecting ? "Stop Inspecting" : "Start Inspecting"}
      </Button>

      {contextMenu && (
        <Portal>
          <Menu isOpen={true} onClose={() => setContextMenu(null)}>
            <MenuButton as={Box} style={{ position: "fixed", top: contextMenu.mouseY, left: contextMenu.mouseX, opacity: 0 }} />
            <MenuList>
              <MenuItem onClick={copyHtml}>Copy HTML</MenuItem>
            </MenuList>
          </Menu>
        </Portal>
      )}
    </Box>
  );
};

export default Index;
