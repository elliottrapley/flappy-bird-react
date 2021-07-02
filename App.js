import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import Bird from './components/Bird'
import Obstacles from './components/Obstacles'

export default function App() {

  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height
  const birdLeft = screenWidth / 2 
  const [birdBottom, setBirdBottom] = useState(screenHeight / 2)
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + screenWidth / 2 + 30)
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0)
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0)
  const gravity = 3
  const obstacleWidth = 60
  const obstacleHeight = 300
  const gap = 200
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(null)

  let gameTimerID
  let obstaclesLeftTimerID 
  let obstaclesLeftTimerIDTwo

  // Start bird falling
  useEffect(() => {
    if (birdBottom > 0) { // As long as birdBottom is greater than 0, set birdBottom - 3 every 30 milliseconds
      gameTimerID = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity)
      }, 30)

      return () => {
        clearInterval(gameTimerID)
      }
    }
  }, [birdBottom])

  console.log(birdBottom)

  const jump = () => {
    if (!isGameOver && (birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50)
      console.log('Jumped!')
    }
    
  }

// Start first obstacles
useEffect(() => {
  if (obstaclesLeft > -obstacleWidth) {
    obstaclesLeftTimerID = setInterval(() => {
      setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5)
    }, 30)
    return () => {
      clearInterval(obstaclesLeftTimerID)
    }
  } else {
    setObstaclesLeft(screenWidth)
    setObstaclesNegHeight(- Math.random() * 100)
  }

  return () => {
    clearInterval(obstaclesLeftTimerID)
  }

}, [obstaclesLeft])


// Start second obstacles
useEffect(() => {
  if (obstaclesLeftTwo > -obstacleWidth) {
    obstaclesLeftTimerIDTwo = setInterval(() => {
      setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5)
    }, 30)
    return () => {
      clearInterval(obstaclesLeftTimerIDTwo)
    }
  } else {
    setObstaclesLeftTwo(screenWidth)
    setObstaclesNegHeightTwo(- Math.random() * 100)
    setScore(score => score + 1)
  }

  return () => {
    clearInterval(obstaclesLeftTimerIDTwo)
  }

}, [obstaclesLeftTwo])

// Check for collisions
useEffect(() => {
  console.log(obstaclesLeft)
  console.log(screenWidth/2)
  console.log(obstaclesLeft > screenWidth/2)
  if (
    ((birdBottom < (obstaclesNegHeight + obstacleHeight + 30) ||
    birdBottom > (obstaclesNegHeight + obstacleHeight + gap -30)) &&
    (obstaclesLeft > screenWidth/2 -30 && obstaclesLeft < screenWidth/2 + 30 )
    )
    || 
    ((birdBottom < (obstaclesNegHeightTwo + obstacleHeight + 30) ||
    birdBottom > (obstaclesNegHeightTwo + obstacleHeight + gap -30)) &&
    (obstaclesLeftTwo > screenWidth/2 -30 && obstaclesLeftTwo < screenWidth/2 + 30 )
    )
    ) 
    {
    console.log('game over')
    gameOver()
    setIsGameOver(true)
  }
})

const gameOver = () => {
  clearInterval(gameTimerID)
  clearInterval(obstaclesLeftTimerID)
  clearInterval(obstaclesLeftTimerIDTwo)
}

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        {isGameOver && <text>{score}</text>}
        <Bird
          birdBottom = {birdBottom}
          birdLeft = {birdLeft}
        />
        <Obstacles
          color = {'yellow'}
          obstacleWidth = {obstacleWidth}
          obstacleHeight = {obstacleHeight}
          randomBottom = {obstaclesNegHeight}
          gap = {gap}
          obstaclesLeft = {obstaclesLeft}
        />
        <Obstacles
          color = {'green'}
          obstacleWidth = {obstacleWidth}
          obstacleHeight = {obstacleHeight}
          randomBottom = {obstaclesNegHeightTwo}
          gap = {gap}
          obstaclesLeft = {obstaclesLeftTwo}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
