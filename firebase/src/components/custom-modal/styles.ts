import {  
  StyleSheet,  
} from 'react-native'; 

export const modalStyles = StyleSheet.create({ 
  screenContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
  }, 
  headerText: { 
    fontSize: 24, 
    fontWeight: '900', 
    marginBottom: 20, 
  }, 
  mainButton: { 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 12, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
  }, 
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
  }, 
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center', 
    alignItems: 'center', 
  }, 
  modalCard: { 
    width: '80%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center', 
    overflow: 'hidden', 
  }, 
  colorIndicator: { 
    width: '120%', 
    height: 10, 
    position: 'absolute', 
    top: 0, 
  }, 
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginTop: 15, 
    marginBottom: 10, 
    color: '#333', 
  }, 
  modalBody: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#666', 
    lineHeight: 22, 
    marginBottom: 20, 
  }, 
  closeButton: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
  }, 
  closeButtonText: { 
    color: '#666', 
    fontWeight: 'bold', 
  }, 
});