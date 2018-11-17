#include <iostream>

using namespace std;

int main(int argc, char const *argv[])
{
  string name;
  int n, x;
  cin >> name >> n;

  cout << "Tu nombre es: " << name << " y estos son tus datos:\n";

  for(int i = 0; i < n; i++) {
    cin >> x;
    cout << x << "\n";
  }
  return 0;
}
