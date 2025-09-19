using UnityEngine;

public class SRT_Transformations : MonoBehaviour
{
    float InitialScale = 2.5f;
    float WAmplitude = 1.5f;
    float NewScale = 0.0f;

    float RotationSpeed = 25.0f;

    float TranslationLength = 1.6f;
    float JumpWindow = 3.0f;
    int[] Sign = { 1, -1 };

    float ElapsedTime = 0.0f;

    void Start() { }

    void Update()
    {
        //SRT Scheme Scheme.

        //Random Translation along X xor Y. 
        if (Time.time >= ElapsedTime + JumpWindow) {
            //Dice sim. Even := X, Odd := Y.
            //Translation is given with respect to the cube's coordinates. It follows is given by the cube's orientation.
            if (Random.Range(0, 6) % 2 == 0)
                transform.Translate(Sign[Random.Range(0, 2)] * TranslationLength, 0, 0);
            else
                transform.Translate(0, Sign[Random.Range(0, 2)] * TranslationLength, 0);

            //Next Jump Window between 2 and 4 secs.
            JumpWindow = Random.Range(2, 5);
            ElapsedTime = Time.time;
        }
        
        
        //Rotation given time in X, Y, Z Axis.
  
        transform.Rotate(RotationSpeed * Time.deltaTime, RotationSpeed * Time.deltaTime, RotationSpeed * Time.deltaTime);
        
 
        //New Scale given time. Min object original Scale: 2.0f (Avoids negative scaling i.e. Undefined behaviour).
        NewScale = InitialScale +  WAmplitude * Mathf.Sin(Time.time);
        transform.localScale = new Vector3(NewScale, NewScale, NewScale);
    }
}
