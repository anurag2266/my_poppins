import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  SectionList,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import countries from './country.json';

import {scale} from './source/Theme/Scalling';

class CountryCodePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
    };
  }

  componentDidMount() {
    this.generateSectionData(countries);
  }

  componentWillUnMount() {}

  onChangeSearchText = text => {
    const filtered = countries.filter(
      country => country.name.toLowerCase().indexOf(text.toLowerCase()) > -1,
    );
    this.generateSectionData(filtered);
  };

  generateSectionData(countryList) {
    const sections = [];
    const sectionHeaders = countryList.map(data => data.name.charAt(0));
    const uniqueHeaders = Array.from(new Set(sectionHeaders));

    uniqueHeaders.forEach(item => {
      const filtered = countryList.filter(
        country => country.name.charAt(0) === item,
      );
      sections.push({title: item, data: filtered});
    });
    this.setState({sections});
  }

  render() {
    const {selected, action} = this.props;
    const {sections} = this.state;
    const SectionHeader = params => (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>{params.title}</Text>
      </View>
    );
    const ItemView = params => {
      let text = `${params.item.name} (+${params.item.callingCode})`;
      let selected = null;
      if (
        this.props.selected != null &&
        this.props.selected.callingCode === params.item.callingCode
      ) {
        selected = (
          <Image
            source={require('./Assets/Icons/logo.png')}
            style={styles.selectionTick}
          />
        );
      }
      return (
        <View style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.itemTextContainer}
            onPress={() => {
              this.props.action(params.item);
              Keyboard.dismiss();
              // this.setState({
              //   modalVisible: false,
              // });
            }}>
            <Image source={{uri: params.item.flag}} style={styles.flag} />
            <Text numberOfLines={1} style={styles.itemText}>
              {text}
            </Text>
            <View style={styles.selectionView}>{selected}</View>
          </TouchableOpacity>
          <View style={styles.itemSeparator} />
        </View>
      );
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({modalVisible: false});
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View>
            <View style={styles.container}>
              <View style={styles.searchContainer}>
                <TouchableOpacity
                  onPress={() => this.props.close()}
                  style={{
                    width: scale(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: scale(30),marginTop:scale(10),
                  }}>
                  <AntDesign name="close" size={20} color="#082e6c" />
                </TouchableOpacity>
                <View style={styles.searchView}>
                  <AntDesign name="search1" size={15} color="black" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Search"
                    placeholderTextColor="#2d2926"
                    enablesReturnKeyAutomatically
                    clearButtonMode="while-editing"
                    autoCapitalize="none"
                    onChangeText={text => this.onChangeSearchText(text)}
                  />
                </View>
              </View>
              <SectionList
                renderItem={({item, index, section}) => (
                  <ItemView
                    item={item}
                    index={index}
                    section={section}
                    action={item => this.props.action(item, index)}
                    selected={selected}
                  />
                )}
                renderSectionHeader={({section: {title}}) => (
                  <SectionHeader title={title} />
                )}
                sections={sections}
                keyExtractor={(item, index) => item + index}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '90%',
    height: '80%',
  },
  imageBackground: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    height: scale(70),
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  searchView: {
    
    flexDirection: 'row',
    backgroundColor: '#bdbdbd30',
    borderWidth: 0,
   alignItems:'center',
    padding: scale(4),
   height:scale(40),width:'94%',alignSelf:'center',marginBottom:scale(7),
  },
  searchIcon: {
    width: scale(20),
    height: scale(20),
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(10),
  },
  textInput: {
    flex: 1,
    height: scale(50),paddingStart:scale(5),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    height: scale(40),
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginLeft: scale(16),
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#2d292670',
  },
  itemContainer: {
    height: scale(50),
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
  },
  itemTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: scale(12.5),
    fontWeight: 'normal',
    color: '#444444',
    flex: 1,
  },
  itemSeparator: {
    height: 1,
    marginLeft: scale(15),
    backgroundColor: '#bdbdbd30',
    marginBottom: 0,
  },
  flag: {
    width: scale(20),
    height: scale(20),
    marginHorizontal: scale(20),
    borderRadius: 0,
  },
  selectionTick: {
    width: scale(15),
    height: scale(15),
    marginRight: scale(20),
  },
  selectionView: {
    alignItems: 'flex-end',
  },
});
export default CountryCodePicker;
