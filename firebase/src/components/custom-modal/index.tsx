import React, { useState } from 'react'; 
import {  
  StyleSheet,  
  Text,  
  View,  
  Modal,  
  TouchableOpacity  
} from 'react-native'; 

import { CustomModalProps } from './types';
import { modalStyles } from './styles';
 

export function CustomModalScreen  ({ animation, themeColor }: CustomModalProps)  { 
  const [visible, setVisible] = useState(false); 
 
  return ( 
    <View style={[modalStyles.screenContainer, { backgroundColor: themeColor + '10' }]}> 
      <Text style={[modalStyles.headerText, { color: themeColor }]}> 
        Modo: {animation ? animation.toUpperCase() : 'NENHUM'} 
      </Text> 
       
      <TouchableOpacity  
        style={[modalStyles.mainButton, { backgroundColor: themeColor }]}  
        onPress={() => setVisible(true)} 
      > 
        <Text style={modalStyles.buttonText}>TESTAR {animation ? animation.toUpperCase() : 'NENHUM'}</Text> 
      </TouchableOpacity> 
 
      <Modal 
        animationType={animation}
        transparent={true}       
        visible={visible}         
        onRequestClose={() => setVisible(false)}
      > 
        <TouchableOpacity  
          style={modalStyles.modalOverlay}  
          activeOpacity={1}  
          onPressOut={() => setVisible(false)} 
        > 
          <View style={modalStyles.modalCard}> 
            <View style={[modalStyles.colorIndicator, { backgroundColor: themeColor }]} /> 
            <Text style={modalStyles.modalTitle}>Animação {animation ? animation.toUpperCase() : 'NENHUM'}</Text> 
            <Text style={modalStyles.modalBody}> 
              {animation === 'slide' && "Perceba como eu subi suavemente do fundo da tela."} 
              {animation === 'fade' && "Perceba como eu surgiu alterando a opacidade (transparência)."} 
              {animation === 'none' && "Eu apareci instantaneamente, sem transição suave."} 
            </Text> 
            <TouchableOpacity  
              style={[modalStyles.closeButton]}  
              onPress={() => setVisible(false)} 
            > 
              <Text style={modalStyles.closeButtonText}>FECHAR</Text> 
            </TouchableOpacity> 
          </View> 
        </TouchableOpacity> 
      </Modal> 
    </View> 
  ); 
}; 